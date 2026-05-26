import { useEffect, useRef, useState, useCallback, type KeyboardEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { apiFetch, getAccessToken, API_BASE } from '../services/apiClient'
import { useAuth, useMockAuth } from '../contexts/AuthContext'
import { mockStats } from '../data/mockStats'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

// ── Streaming cursor ──────────────────────────────────────────────
function StreamingCursor() {
  return <span className="inline-block w-0.5 h-4 bg-gray-500 dark:bg-gray-400 ml-0.5 animate-pulse align-middle" />
}

// ── Single message bubble ─────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-xs font-bold text-violet-700 dark:text-violet-300 shrink-0 mr-2 mt-1">
          AI
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-violet-600 text-white rounded-br-sm'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700/60 shadow-sm rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-pre:my-2">
            <ReactMarkdown>{message.content}</ReactMarkdown>
            {message.streaming && <StreamingCursor />}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
      <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600 dark:text-violet-400">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">向 AI 助手提问</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">获取基于你学习数据的个性化建议</p>
      </div>
    </div>
  )
}

// ── Main ChatPage ─────────────────────────────────────────────────
export default function ChatPage() {
  const { user } = useAuth()
  const mockAuth = useMockAuth()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Load conversation on mount
  useEffect(() => {
    if (mockAuth) {
      setConversationId('mock-conv-id')
      return
    }
    apiFetch('/api/v1/chat/conversation')
      .then(r => r.json())
      .then(data => {
        setConversationId(data.id)
        return apiFetch('/api/v1/chat/conversation/messages')
      })
      .then(r => r.json())
      .then((msgs: Array<{ id: string; role: string; content: string }>) => {
        setMessages(msgs.map(m => ({ id: m.id, role: m.role as 'user' | 'assistant', content: m.content })))
      })
      .catch(() => {/* silent: show empty state */})
  }, [mockAuth])

  // Auto-scroll when messages change
  useEffect(() => {
    if (isAtBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAtBottom])

  // Detect scroll position
  const handleScroll = useCallback(() => {
    const el = listRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60
    setIsAtBottom(atBottom)
  }, [])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming || !conversationId) return

    setInput('')
    setStreaming(true)
    setIsAtBottom(true)

    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text }
    const assistantMsg: Message = { id: `a-${Date.now()}`, role: 'assistant', content: '', streaming: true }

    setMessages(prev => [...prev, userMsg, assistantMsg])

    const context = {
      streak_days: user?.current_streak_days ?? 0,
      level: user?.level ?? 1,
      completed_tasks: mockStats.completedTasks,
      total_study_minutes: mockStats.totalStudyMinutes,
    }

    if (mockAuth) {
      // Mock streaming in demo mode
      const reply = '我是 AI 学习助手（演示模式）。你的学习数据看起来不错！建议今天专注复习最近学习的内容，保持连续打卡的好习惯。'
      let i = 0
      const tick = setInterval(() => {
        i += 2
        setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: reply.slice(0, i), streaming: i < reply.length } : m))
        if (i >= reply.length) { clearInterval(tick); setStreaming(false) }
      }, 30)
      return
    }

    const abort = new AbortController()
    abortRef.current = abort

    try {
      const token = getAccessToken()
      const res = await fetch(`${API_BASE}/api/v1/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: text, conversation_id: conversationId, context }),
        signal: abort.signal,
      })

      if (!res.ok || !res.body) {
        setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: 'AI 服务暂时不可用，请稍后重试。', streaming: false } : m))
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6)
          if (raw === '[DONE]') break
          try {
            const parsed = JSON.parse(raw)
            if (parsed.error) {
              setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: parsed.error, streaming: false } : m))
              return
            }
            if (parsed.token) {
              setMessages(prev => prev.map(m =>
                m.id === assistantMsg.id ? { ...m, content: m.content + parsed.token } : m
              ))
            }
          } catch { /* ignore malformed chunk */ }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, content: '网络错误，请检查连接后重试。', streaming: false } : m))
      }
    } finally {
      setMessages(prev => prev.map(m => m.id === assistantMsg.id ? { ...m, streaming: false } : m))
      setStreaming(false)
    }
  }, [input, streaming, conversationId, user, mockAuth])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleNewConversation = async () => {
    if (!mockAuth) {
      await apiFetch('/api/v1/chat/conversation', { method: 'DELETE' })
    }
    setMessages([])
    setIsAtBottom(true)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] max-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600 dark:text-violet-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white">AI 学习助手</h1>
        </div>
        <button
          type="button"
          onClick={handleNewConversation}
          className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          新对话
        </button>
      </div>

      {/* Message list */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-gray-950"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 py-3 border-t border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900">
        <div className="flex items-end gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 focus-within:ring-2 focus-within:ring-violet-500 transition-shadow">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={streaming}
            placeholder="向 AI 助手提问… (Enter 发送，Shift+Enter 换行)"
            rows={1}
            className="flex-1 resize-none text-sm text-gray-900 dark:text-white bg-transparent placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none disabled:opacity-50 max-h-32"
            style={{ lineHeight: '1.5' }}
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={streaming || !input.trim()}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-1.5">AI 建议仅供参考，以实际学习情况为准</p>
      </div>
    </div>
  )
}
