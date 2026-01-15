'use client'

import { cn } from '@/lib/utils'
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface HorizontalBarChartProps {
  data: Array<{
    name: string
    value: number
    percentage?: number
  }>
  title?: string
  subtitle?: string
  valueLabel?: string
  color?: string
  showPercentage?: boolean
  className?: string
}

export function HorizontalBarChart({
  data,
  title,
  subtitle,
  valueLabel = 'Value',
  color = '#FBBF24',
  showPercentage = true,
  className,
}: HorizontalBarChartProps) {
  // Generate gradient colors
  const colors = [
    '#EF4444', // red
    '#F97316', // orange
    '#FBBF24', // yellow
    '#50F172', // green
    '#07F0FF', // cyan
    '#3B82F6', // blue
  ]

  return (
    <div className={cn('bg-card border border-border rounded-xl p-5', className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-text-primary font-semibold">{title}</h3>}
          {subtitle && <p className="text-text-muted text-sm mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="space-y-3">
        {data.map((item, index) => {
          const maxValue = Math.max(...data.map((d) => d.value))
          const widthPercent = (item.value / maxValue) * 100

          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-24 text-sm text-text-secondary truncate">
                {item.name}
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 h-8 bg-background rounded relative overflow-hidden">
                  <div
                    className="h-full rounded flex items-center justify-start px-3 transition-all duration-500"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: colors[index % colors.length],
                    }}
                  >
                    <span className="text-background text-sm font-bold">
                      {item.value.toLocaleString('fr-FR')}
                    </span>
                  </div>
                </div>
                {showPercentage && item.percentage !== undefined && (
                  <span className="w-12 text-right text-sm text-text-muted">
                    {item.percentage.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface VerticalBarChartProps {
  data: Array<{
    name: string
    value: number
  }>
  title?: string
  subtitle?: string
  color?: string
  height?: number
  className?: string
}

export function VerticalBarChart({
  data,
  title,
  subtitle,
  color = '#FBBF24',
  height = 200,
  className,
}: VerticalBarChartProps) {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-5', className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-text-primary font-semibold">{title}</h3>}
          {subtitle && <p className="text-text-muted text-sm mt-1">{subtitle}</p>}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <RechartsBar data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717A', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#71717A', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{
              backgroundColor: '#18181B',
              border: '1px solid #27272A',
              borderRadius: '8px',
              color: '#FFFFFF',
            }}
          />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  )
}
