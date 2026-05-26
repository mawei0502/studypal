import { useEffect, useState } from 'react'
import { apiFetch } from '../../services/apiClient'
import { useMockAuth } from '../../contexts/AuthContext'

interface CardDef {
  label: string
  unit: string
  key: string
  icon: React.ReactNode
  color: string
}

interface StatsData {
  total_study_minutes: number
  completed_tasks: number
  current_streak_days: number
  longest_streak_days: number
}

const cards: CardDef[] = [
  {
    label: '累计学习',
    unit: '分钟',
    key: 'total_study_minutes',
    color: 'text-violet-600 dark:text-violet-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: '已完成任务',
    unit: '个',
    key: 'completed_tasks',
    color: 'text-emerald-600 dark:text-emerald-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    label: '连续打卡',
    unit: '天',
    key: 'current_streak_days',
    color: 'text-orange-500 dark:text-orange-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    label: '最长连续',
    unit: '天',
    key: 'longest_streak_days',
    color: 'text-sky-600 dark:text-sky-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
]

export default function StatsCards() {
  const mockAuth = useMockAuth()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (mockAuth) {
      setLoading(false)
      return
    }
    apiFetch('/api/v1/analytics/stats')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => { setStats(null); setLoading(false) })
  }, [mockAuth])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.key} className="h-28 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((c) => {
        const value = stats ? (stats as unknown as Record<string, number>)[c.key] : undefined
        return (
          <div
            key={c.key}
            className="flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 shadow-sm"
          >
            <div className={c.color}>{c.icon}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{c.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
              {value !== undefined ? value : '—'}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{c.unit}</span>
            </p>
          </div>
        )
      })}
    </div>
  )
}
