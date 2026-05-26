import { useEffect, useState } from 'react'
import { apiFetch } from '../../services/apiClient'
import { useMockAuth } from '../../contexts/AuthContext'

interface CalendarDay {
  date: string
  study_minutes: number
}

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

function getIntensity(minutes: number): string {
  if (minutes === 0) return 'bg-gray-100 dark:bg-gray-800'
  if (minutes <= 15) return 'bg-green-200 dark:bg-green-900'
  if (minutes <= 30) return 'bg-green-400 dark:bg-green-700'
  if (minutes <= 60) return 'bg-green-500 dark:bg-green-600'
  return 'bg-green-700 dark:bg-green-500'
}

export default function StudyCalendar() {
  const mockAuth = useMockAuth()
  const [data, setData] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)
  const [tooltip, setTooltip] = useState<{ date: string; minutes: number; x: number; y: number } | null>(null)
  const year = 2026

  useEffect(() => {
    if (mockAuth) { setLoading(false); return }
    apiFetch(`/api/v1/analytics/calendar?year=${year}`)
      .then(r => r.json())
      .then((entries: CalendarDay[]) => {
        const map = new Map<string, number>()
        for (const e of entries) map.set(e.date, e.study_minutes)
        setData(map)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [mockAuth, year])

  // Generate 365 days grid
  const days: { date: string; dayOfWeek: number }[] = []
  const startDate = new Date(year, 0, 1)
  for (let i = 0; i < 365; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    // dayOfWeek: 0=Sun..6=Sat, shift to Mon=0..Sun=6
    const dow = (d.getDay() + 6) % 7
    days.push({ date: iso, dayOfWeek: dow })
  }

  // Group into weeks (columns)
  const weeks: { date: string; dayOfWeek: number }[][] = []
  let currentWeek: { date: string; dayOfWeek: number }[] = []
  for (const day of days) {
    currentWeek.push(day)
    if (day.dayOfWeek === 6) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek)

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/60 p-5">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4 animate-pulse" />
        <div className="flex gap-1 overflow-hidden">
          {Array.from({ length: 53 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-700 animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/60 p-5 relative">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">学习日历 {year}</h3>

      <div className="flex gap-1 overflow-x-auto">
        {/* Weekday labels */}
        <div className="flex flex-col gap-1 mr-1">
          {WEEKDAYS.map(d => (
            <div key={d} className="w-3 h-3 text-[8px] text-gray-400 dark:text-gray-500 flex items-center justify-center">
              {d}
            </div>
          ))}
        </div>
        {/* Heatmap grid */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map(day => {
              const minutes = data.get(day.date) ?? 0
              return (
                <div
                  key={day.date}
                  className={`w-3 h-3 rounded-sm cursor-pointer ${getIntensity(minutes)}`}
                  onMouseEnter={e => {
                    const rect = (e.target as HTMLElement).getBoundingClientRect()
                    setTooltip({ date: day.date, minutes, x: rect.left, y: rect.top - 8 })
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              )
            })}
            {/* Fill empty cells in incomplete weeks */}
            {week.length < 7 && Array.from({ length: 7 - week.length }).map((_, i) => (
              <div key={`empty-${wi}-${i}`} className="w-3 h-3" />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 dark:text-gray-500">
        <span>少</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
        <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
        <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
        <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600" />
        <div className="w-3 h-3 rounded-sm bg-green-700 dark:bg-green-500" />
        <span>多</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs bg-gray-900 dark:bg-gray-700 text-white rounded-md shadow-lg pointer-events-none whitespace-nowrap"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.date}：{tooltip.minutes} 分钟
        </div>
      )}
    </div>
  )
}
