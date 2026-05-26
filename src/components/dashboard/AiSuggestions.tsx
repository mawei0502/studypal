import { useState } from 'react'
import { mockSuggestions, type AiSuggestion } from '../../data/mockSuggestions'

interface Props {
  suggestions?: AiSuggestion[]
}

function pickRandom(arr: AiSuggestion[], count: number): AiSuggestion[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function isValidSuggestion(s: unknown): s is AiSuggestion {
  if (!s || typeof s !== 'object') return false
  const obj = s as Record<string, unknown>
  if (!obj.title) {
    console.warn('[AiSuggestions] 跳过缺少 title 字段的建议条目', s)
    return false
  }
  return true
}

interface CardProps {
  suggestion: AiSuggestion
}

function SuggestionCard({ suggestion }: CardProps) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{suggestion.title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{suggestion.reason}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">{suggestion.estimatedMinutes} 分钟</span>
        <div className="flex flex-wrap gap-1 justify-end">
          {suggestion.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AiSuggestions({ suggestions: externalSuggestions }: Props) {
  const source = (externalSuggestions ?? mockSuggestions).filter(isValidSuggestion)
  const [displayed, setDisplayed] = useState<AiSuggestion[]>(() => pickRandom(source, 3))

  function handleRefresh() {
    setDisplayed(pickRandom(source, 3))
  }

  if (source.length === 0) {
    return (
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">AI 建议</h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">暂无建议，稍后再试</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">AI 建议学习</h2>
        <button
          type="button"
          onClick={handleRefresh}
          className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          刷新建议
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map((s) => (
          <SuggestionCard key={s.id} suggestion={s} />
        ))}
      </div>
    </div>
  )
}
