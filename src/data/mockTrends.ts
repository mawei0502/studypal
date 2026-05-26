export interface TrendPoint {
  date: string
  studyMinutes: number
}

export interface TrendSeries {
  range: 'week' | 'month'
  points: TrendPoint[]
}

const today = new Date()

function daysAgo(n: number): string {
  const d = new Date(today)
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export const weekTrends: TrendSeries = {
  range: 'week',
  points: [
    { date: daysAgo(6), studyMinutes: 45 },
    { date: daysAgo(5), studyMinutes: 90 },
    { date: daysAgo(4), studyMinutes: 30 },
    { date: daysAgo(3), studyMinutes: 120 },
    { date: daysAgo(2), studyMinutes: 75 },
    { date: daysAgo(1), studyMinutes: 100 },
    { date: daysAgo(0), studyMinutes: 60 },
  ],
}

export const monthTrends: TrendSeries = {
  range: 'month',
  points: Array.from({ length: 30 }, (_, i) => ({
    date: daysAgo(29 - i),
    studyMinutes: Math.floor(Math.random() * 100 + 20),
  })),
}

export const mockTrends: Record<'week' | 'month', TrendSeries> = {
  week: weekTrends,
  month: monthTrends,
}
