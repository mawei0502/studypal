import { Component, lazy, Suspense, useState } from 'react'
import type { ReactNode } from 'react'
import { mockTrends } from '../../data/mockTrends'

type Range = 'week' | 'month'

const RechartsBundle = lazy(() => import('./RechartsBundle'))

interface ErrorBoundaryState {
  hasError: boolean
}

class ChartErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-48 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-400 dark:text-gray-500">
          图表加载失败
        </div>
      )
    }
    return this.props.children
  }
}

function ChartSkeleton() {
  return (
    <div className="h-48 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
  )
}

function RangeToggle({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  const options: { label: string; value: Range }[] = [
    { label: '周', value: 'week' },
    { label: '月', value: 'month' },
  ]
  return (
    <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-xs">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 transition-colors ${
            value === opt.value
              ? 'bg-violet-600 dark:bg-violet-500 text-white font-semibold'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function TrendChart() {
  const [range, setRange] = useState<Range>('week')
  const series = mockTrends[range]

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">学习趋势</h2>
        <RangeToggle value={range} onChange={setRange} />
      </div>

      {series.points.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-sm text-gray-400 dark:text-gray-500">
          暂无数据
        </div>
      ) : (
        <ChartErrorBoundary>
          <Suspense fallback={<ChartSkeleton />}>
            <RechartsBundle points={series.points} />
          </Suspense>
        </ChartErrorBoundary>
      )}
    </div>
  )
}
