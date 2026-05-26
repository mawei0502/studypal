import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../services/apiClient'

interface UserProfile {
  id: string
  email: string
  display_name: string
  avatar_url: string | null
  current_streak_days: number
  level: number
}

function AvatarPlaceholder({ name }: { name: string }) {
  const letter = name?.charAt(0)?.toUpperCase() ?? '?'
  return (
    <div className="w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-2xl font-bold text-violet-700 dark:text-violet-300">
      {letter}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="p-6 space-y-6 max-w-lg">
      <div className="h-8 w-32 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(user as UserProfile | null)
  const [loading, setLoading] = useState(!user)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setProfile(user as UserProfile)
      setLoading(false)
      return
    }
    apiFetch('/api/v1/users/me')
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        setUser(data)
      })
      .catch(() => setError('加载失败，请刷新重试'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Skeleton />
  if (error) return <p className="p-6 text-sm text-red-500">{error}</p>
  if (!profile) return null

  const levelLabels: Record<number, string> = { 1: '新手', 2: '学徒', 3: '进阶', 4: '资深', 5: '大师' }
  const levelLabel = levelLabels[profile.level] ?? `Lv.${profile.level}`

  return (
    <div className="p-6 space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">我的 Profile</h1>

      <div className="flex items-center gap-4 p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 shadow-sm">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="w-20 h-20 rounded-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            loading="lazy"
          />
        ) : (
          <AvatarPlaceholder name={profile.display_name || profile.email} />
        )}
        <div className="space-y-1">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile.display_name || profile.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
            {levelLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 shadow-sm text-center">
          <p className="text-3xl font-bold text-orange-500 dark:text-orange-400">{profile.current_streak_days}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">连续学习天数</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 shadow-sm text-center">
          <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">{profile.level}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">用户等级</p>
        </div>
      </div>
    </div>
  )
}
