'use client'

import { cn, getStatusColor } from '@/lib/utils'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (value: any, row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  title?: string
  subtitle?: string
  className?: string
  emptyMessage?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  title,
  subtitle,
  className,
  emptyMessage = 'Aucune donnée disponible',
}: DataTableProps<T>) {
  const getNestedValue = (obj: T, path: string): any => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj)
  }

  return (
    <div className={cn('bg-card border border-border rounded-xl overflow-hidden', className)}>
      {(title || subtitle) && (
        <div className="px-5 py-4 border-b border-border">
          {title && <h3 className="text-text-primary font-semibold">{title}</h3>}
          {subtitle && <p className="text-text-muted text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-5 py-3 text-xs font-medium text-text-muted uppercase tracking-wider',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.align !== 'center' && col.align !== 'right' && 'text-left'
                  )}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-8 text-center text-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-card-hover transition-colors"
                >
                  {columns.map((col, colIndex) => {
                    const value = getNestedValue(row, col.key as string)
                    return (
                      <td
                        key={colIndex}
                        className={cn(
                          'px-5 py-4 text-sm text-text-primary whitespace-nowrap',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right'
                        )}
                      >
                        {col.render ? col.render(value, row) : value}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Helper components for common table cell renderers
export function RateCell({ 
  value, 
  thresholds = { good: 2.2, warning: 1.8 } 
}: { 
  value: number
  thresholds?: { good: number; warning: number }
}) {
  return (
    <span className={cn('font-medium', getStatusColor(value, thresholds))}>
      {value.toFixed(2)}%
    </span>
  )
}

export function CurrencyCell({ value, currency = 'EUR' }: { value: number; currency?: string }) {
  return (
    <span className="text-text-primary">
      {new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
      }).format(value)}
    </span>
  )
}

export function NumberCell({ value }: { value: number }) {
  return (
    <span className="text-oms-cyan font-medium">
      {value.toLocaleString('fr-FR')}
    </span>
  )
}

export function StatusDot({ 
  color = 'green' 
}: { 
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'violet' 
}) {
  const colors = {
    green: 'bg-oms-green',
    yellow: 'bg-oms-yellow',
    red: 'bg-error',
    blue: 'bg-oms-blue',
    violet: 'bg-oms-violet',
  }
  
  return <span className={cn('inline-block w-2 h-2 rounded-full mr-2', colors[color])} />
}
