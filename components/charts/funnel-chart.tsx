'use client'

import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

interface FunnelStep {
  name: string
  value: number
  percentage: number
}

interface FunnelChartProps {
  steps: FunnelStep[]
  title?: string
  className?: string
}

export function FunnelChart({ steps, title, className }: FunnelChartProps) {
  return (
    <div className={cn('bg-card border border-border rounded-xl p-5', className)}>
      {title && (
        <h3 className="text-text-primary font-semibold mb-4">{title}</h3>
      )}

      <div className="flex items-stretch gap-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="bg-background rounded-lg px-6 py-4 text-center min-w-[100px]">
                <p className="text-text-primary text-2xl font-bold">
                  {step.value.toLocaleString('fr-FR')}
                </p>
                <p className="text-text-muted text-xs mt-1">{step.name}</p>
                <p className="text-oms-green text-sm font-medium mt-1">
                  {step.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-5 h-5 text-text-muted mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface SimpleFunnelProps {
  data: Array<{
    label: string
    value: number
  }>
  title?: string
  className?: string
}

export function SimpleFunnel({ data, title, className }: SimpleFunnelProps) {
  const maxValue = data[0]?.value || 1

  return (
    <div className={cn('bg-card border border-border rounded-xl p-5', className)}>
      {title && (
        <h3 className="text-text-primary font-semibold mb-4">{title}</h3>
      )}

      <div className="space-y-3">
        {data.map((item, index) => {
          const widthPercent = (item.value / maxValue) * 100
          const stepPercent = index === 0 ? 100 : (item.value / data[0].value) * 100

          return (
            <div key={index} className="relative">
              <div
                className="h-12 rounded-lg flex items-center justify-between px-4 transition-all"
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: `rgba(80, 241, 114, ${0.2 + (1 - index / data.length) * 0.3})`,
                  minWidth: '120px',
                }}
              >
                <span className="text-text-primary font-medium text-sm">
                  {item.label}
                </span>
                <div className="text-right">
                  <span className="text-text-primary font-bold">
                    {item.value.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-oms-green text-sm ml-2">
                    ({stepPercent.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
