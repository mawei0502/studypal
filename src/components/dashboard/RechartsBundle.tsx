import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TrendPoint } from '../../data/mockTrends'

interface Props {
  points: TrendPoint[]
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function RechartsBundle({ points }: Props) {
  return (
    <ResponsiveContainer width="100%" height={192}>
      <LineChart data={points} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.3)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          unit="m"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--tw-bg-opacity, rgba(17,24,39,0.95))',
            border: '1px solid rgba(107,114,128,0.3)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value) => [`${value ?? '—'} 分钟`, '学习时长']}
          labelFormatter={(label) => formatDate(label as string)}
        />
        <Line
          type="monotone"
          dataKey="studyMinutes"
          stroke="#a78bfa"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#a78bfa' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
