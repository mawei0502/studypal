interface Achievement {
  slug: string
  title: string
  description: string
  icon_url: string | null
  unlocked: boolean
  unlocked_at: string | null
}

export default function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div
      className={`relative rounded-xl border p-4 transition-colors ${
        achievement.unlocked
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 shadow-sm'
          : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/40 opacity-60'
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 ${
        achievement.unlocked
          ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
      }`}>
        {achievement.unlocked ? '🏆' : '🔒'}
      </div>

      <h3 className={`text-sm font-semibold mb-1 ${
        achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
      }`}>
        {achievement.title}
      </h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{achievement.description}</p>

      {achievement.unlocked ? (
        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
          已解锁
        </span>
      ) : (
        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
          未解锁
        </span>
      )}
    </div>
  )
}
