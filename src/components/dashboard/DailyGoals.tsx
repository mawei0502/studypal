import { useState } from 'react'
import { mockGoals, type DailyGoal } from '../../data/mockGoals'

interface Props {
  goals?: DailyGoal[]
}

interface GoalItemProps {
  goal: DailyGoal
  onToggle: (id: string) => void
}

function GoalItem({ goal, onToggle }: GoalItemProps) {
  return (
    <li className="flex items-start gap-3 py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <button
        type="button"
        onClick={() => onToggle(goal.id)}
        aria-label={goal.completed ? '取消完成' : '标记完成'}
        className={`mt-0.5 w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
          goal.completed
            ? 'bg-violet-600 border-violet-600 dark:bg-violet-500 dark:border-violet-500'
            : 'border-gray-400 dark:border-gray-500 hover:border-violet-500'
        }`}
      >
        {goal.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${goal.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
          {goal.title}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{goal.estimatedMinutes} 分钟</p>
      </div>
    </li>
  )
}

export default function DailyGoals({ goals: initialGoals }: Props) {
  const [goals, setGoals] = useState<DailyGoal[]>(initialGoals ?? mockGoals)

  function handleToggle(id: string) {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    )
  }

  if (goals.length === 0) {
    return (
      <div className="flex flex-col gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">今日目标</h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
          今天还没有目标，添加一个开始学习吧
        </p>
      </div>
    )
  }

  const done = goals.filter((g) => g.completed).length

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">今日目标</h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">{done}/{goals.length} 完成</span>
      </div>
      <ul className="divide-y divide-transparent">
        {goals.map((g) => (
          <GoalItem key={g.id} goal={g} onToggle={handleToggle} />
        ))}
      </ul>
    </div>
  )
}
