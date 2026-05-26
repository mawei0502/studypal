export interface StatsSummary {
  totalStudyMinutes: number
  completedTasks: number
  currentStreakDays: number
  longestStreakDays: number
}

export const mockStats: StatsSummary = {
  totalStudyMinutes: 1842,
  completedTasks: 47,
  currentStreakDays: 12,
  longestStreakDays: 31,
}
