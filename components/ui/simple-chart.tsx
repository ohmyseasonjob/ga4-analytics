'use client'

import { cn } from '@/lib/utils'
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

interface LineConfig {
  dataKey: string
  color: string
  name: string
}

interface SimpleChartProps {
  data: Array<Record<string, any>>
  title?: string
  subtitle?: string
  lines: LineConfig[]
  xAxisKey: string
  className?: string
  height?: number
}

export function SimpleChart({
  data,
  title,
  subtitle,
  lines,
  xAxisKey,
  className,
  height = 300,
}: SimpleChartProps) {
  return (
    <div className={cn('bg-[#1a1a1a] border border-[#262626] rounded-xl p-6', className)}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-white font-semibold">{title}</h3>}
          {subtitle && <p className="text-[#808080] text-sm mt-1">{subtitle}</p>}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <RechartsLine
          data={data}
          margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#808080', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#808080', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ stroke: '#262626', strokeWidth: 1 }}
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #262626',
              borderRadius: '8px',
              color: '#FFFFFF',
            }}
            labelStyle={{ color: '#FFFFFF' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
            formatter={(value) => <span style={{ color: '#FFFFFF' }}>{value}</span>}
          />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={2}
              dot={{ fill: line.color, r: 4 }}
              activeDot={{ r: 6 }}
              name={line.name}
            />
          ))}
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  )
}
