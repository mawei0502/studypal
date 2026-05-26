import { useEffect, useRef, useState, useCallback } from 'react'

interface Goal {
  id: string
  text: string
  category: string
  done: boolean
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(() => goalDefaults())
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const seen = useRef(new Set<string>())

  const today = new Date().toISOString().slice(0, 10)

  function goalDefaults(): Goal[] {
    return [
      { id: 'g1', text: '完成今日学习打卡', category: '学习', done: false },
      { id: 'g2', text: '复习昨日知识点', category: '复习', done: false },
      { id: 'g3', text: '阅读一篇技术文章', category: '阅读', done: false },
    ]
  }

  // Load saved goals from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`goals_${today}`)
      if (saved) {
        const parsed: Goal[] = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGoals(parsed)
        }
      }
    } catch {
      /* ignore */
    }
  }, [today])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(`goals_${today}`, JSON.stringify(goals))
  }, [goals, today])

  const toggle = useCallback((id: string) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, done: !g.done } : g)))
  }, [])

  const addGoal = useCallback(() => {
    const text = input.trim()
    if (!text) return
    if (seen.current.has(text.toLowerCase())) return
    seen.current.add(text.toLowerCase())
    setGoals(prev => [...prev, { id: `g${Date.now()}`, text, category: '自定义', done: false }])
    setInput('')
    inputRef.current?.focus()
  }, [input])

  const removeGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">学习目标</h1>

      {/* Add new goal */}
      <div className="flex gap-2 mb-6">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addGoal() }}
          placeholder="添加新目标…"
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          type="button"
          onClick={addGoal}
          disabled={!input.trim()}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-40"
        >
          添加
        </button>
      </div>

      {/* Goal list */}
      <ul className="space-y-2">
        {goals.map(goal => (
          <li
            key={goal.id}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 shadow-sm"
          >
            <input
              type="checkbox"
              checked={goal.done}
              onChange={() => toggle(goal.id)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500 cursor-pointer"
            />
            <span
              className={`flex-1 text-sm ${
                goal.done
                  ? 'line-through text-gray-400 dark:text-gray-500'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {goal.text}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              {goal.category}
            </span>
            <button
              type="button"
              onClick={() => removeGoal(goal.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="删除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {goals.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
          还没有目标，输入上方文本框添加第一个目标
        </p>
      )}
    </div>
  )
}
