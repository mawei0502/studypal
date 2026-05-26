import AchievementCard from './AchievementCard'

interface Achievement {
  slug: string
  title: string
  description: string
  icon_url: string | null
  unlocked: boolean
  unlocked_at: string | null
}

export default function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  if (achievements.length === 0) {
    return <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">暂无成就数据</p>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {achievements.map(ach => (
        <AchievementCard key={ach.slug} achievement={ach} />
      ))}
    </div>
  )
}
