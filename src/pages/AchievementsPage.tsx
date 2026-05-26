import { useEffect, useState } from 'react'
import { apiFetch } from '../services/apiClient'
import { useMockAuth } from '../contexts/AuthContext'
import AchievementGrid from '../components/dashboard/AchievementGrid'

interface Achievement {
  slug: string
  title: string
  description: string
  icon_url: string | null
  unlocked: boolean
  unlocked_at: string | null
}

export default function AchievementsPage() {
  const mockAuth = useMockAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (mockAuth) {
      setLoading(false)
      return
    }
    apiFetch('/api/v1/analytics/achievements')
      .then(r => r.json())
      .then(data => { setAchievements(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [mockAuth])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">成就系统</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700/60 p-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">成就系统</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">成就数据暂时不可用</p>
        <button
          type="button"
          onClick={() => { setLoading(true); setError(false); window.location.reload() }}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">成就系统</h1>
      <AchievementGrid achievements={achievements} />
    </div>
  )
}
