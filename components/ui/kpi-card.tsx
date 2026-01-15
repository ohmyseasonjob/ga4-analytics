'use client'

import { cn, formatNumber, formatPercent, formatCurrency, formatDuration, formatChange, getChangeColor } from '@/lib/utils'
import type { KPIData } from '@/types'
import type { ReactNode } from 'react'

interface KPICardProps {
  // Format 1: avec objet data
  data?: KPIData
  // Format 2: avec props individuels
  title?: string
  value?: string | number
  change?: number
  icon?: ReactNode
  subtitle?: string
  invertChange?: boolean
  className?: string
}

export function KPICard(props: KPICardProps) {
  const { className, data: dataProp, title, value, change, icon, subtitle, invertChange } = props
  
  // Normalize data from either format
  const data: KPIData = dataProp || {
    label: title || '',
    value: value || 0,
    change: invertChange && change !== undefined ? -change : change,
    changeLabel: subtitle,
  }

  const formatValue = () => {
    // If value is already a string (like "2:34" or "42%"), return as is
    if (typeof data.value === 'string') {
      return data.value
    }

    switch (data.format) {
      case 'percent':
        return formatPercent(data.value as number)
      case 'currency':
        return formatCurrency(data.value as number)
      case 'duration':
        return formatDuration(data.value as number)
      case 'number':
      default:
        return formatNumber(data.value as number)
    }
  }

  return (
    <div
      className={cn(
        'relative bg-[#1a1a1a] border border-[#262626] rounded-xl p-5 transition-all hover:border-[#333]',
        className
      )}
    >
      {/* Source badge */}
      {data.source && (
        <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium rounded bg-oms-yellow/20 text-oms-yellow">
          {data.source}
        </span>
      )}

      {/* Icon */}
      {icon && (
        <div className="mb-3 text-[#808080]">
          {icon}
        </div>
      )}

      {/* Label */}
      <p className="text-[#808080] text-sm mb-2">{data.label}</p>

      {/* Value */}
      <p className="text-white text-3xl font-bold tracking-tight">
        {formatValue()}
      </p>

      {/* Change indicator */}
      {data.change !== undefined && (
        <p className={cn('text-sm mt-2 font-medium', getChangeColor(data.change))}>
          {formatChange(data.change)}
          {data.changeLabel && (
            <span className="text-[#808080] font-normal ml-1">
              {data.changeLabel}
            </span>
          )}
        </p>
      )}
    </div>
  )
}

interface KPIRowProps {
  items: KPIData[]
  className?: string
}

export function KPIRow({ items, className }: KPIRowProps) {
  return (
    <div className={cn('grid gap-4', className)} style={{
      gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`
    }}>
      {items.map((item, index) => (
        <KPICard key={index} data={item} />
      ))}
    </div>
  )
}
