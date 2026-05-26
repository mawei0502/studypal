import StatsCards from '../components/dashboard/StatsCards'
import AiSuggestions from '../components/dashboard/AiSuggestions'
import TrendChart from '../components/dashboard/TrendChart'
import StudyCalendar from '../components/dashboard/StudyCalendar'

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">学习 Dashboard</h1>

      {/* 统计卡片 */}
      <StatsCards />

      {/* 学习日历 */}
      <StudyCalendar />

      {/* 中间两列：AI 建议 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <AiSuggestions />
        </div>
      </div>

      {/* 趋势图 */}
      <TrendChart />
    </div>
  )
}
