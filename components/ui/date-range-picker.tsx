'use client'

import { useState, useMemo, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Calendar, ChevronDown } from 'lucide-react'
import { 
  format, 
  subDays, 
  startOfMonth, 
  endOfMonth, 
  subMonths,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
  addMonths,
  subMonths as subMonth,
  getDaysInMonth
} from 'date-fns'
import { fr, enUS } from 'date-fns/locale'
import { useI18n } from '@/lib/i18n'

interface DateRange {
  startDate: Date
  endDate: Date
  label: string
}

function getPresets(t: (key: string) => string): DateRange[] {
  return [
    {
      label: t('dateRange.last7Days'),
      startDate: subDays(new Date(), 6),
      endDate: new Date(),
    },
    {
      label: t('dateRange.last14Days'),
      startDate: subDays(new Date(), 13),
      endDate: new Date(),
    },
    {
      label: t('dateRange.last30Days'),
      startDate: subDays(new Date(), 29),
      endDate: new Date(),
    },
    {
      label: t('dateRange.thisMonth'),
      startDate: startOfMonth(new Date()),
      endDate: new Date(),
    },
    {
      label: t('dateRange.lastMonth'),
      startDate: startOfMonth(subMonths(new Date(), 1)),
      endDate: endOfMonth(subMonths(new Date(), 1)),
    },
  ]
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  // Always use French locale for dates
  const dateLocale = fr
  const presets = useMemo(() => getPresets(t), [t])
  const isCustomRange = !presets.some(p => p.label === value.label)
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>(isCustomRange ? 'custom' : 'presets')
  const [customStartDate, setCustomStartDate] = useState<Date | null>(
    isCustomRange ? value.startDate : null
  )
  const [customEndDate, setCustomEndDate] = useState<Date | null>(
    isCustomRange ? value.endDate : null
  )
  const [currentMonth, setCurrentMonth] = useState(
    isCustomRange ? value.startDate : new Date()
  )

  const handlePresetSelect = (preset: DateRange) => {
    onChange(preset)
    setIsOpen(false)
  }

  const handleCustomDateClick = (date: Date) => {
    if (!customStartDate || (customStartDate && customEndDate)) {
      // Start new selection
      setCustomStartDate(date)
      setCustomEndDate(null)
    } else if (customStartDate && !customEndDate) {
      // Select end date
      if (isBefore(date, customStartDate)) {
        // If clicked date is before start, swap them
        setCustomEndDate(customStartDate)
        setCustomStartDate(date)
      } else {
        setCustomEndDate(date)
      }
    }
  }

  const handleCustomRangeApply = () => {
    if (customStartDate && customEndDate) {
      const label = `${format(customStartDate, 'd MMM', { locale: dateLocale })} - ${format(customEndDate, 'd MMM yyyy', { locale: dateLocale })}`
      onChange({
        startDate: customStartDate,
        endDate: customEndDate,
        label,
      })
      setIsOpen(false)
    }
  }

  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }

  const isDateInRange = (date: Date) => {
    if (!customStartDate || !customEndDate) return false
    return (
      (isSameDay(date, customStartDate) || isAfter(date, customStartDate)) &&
      (isSameDay(date, customEndDate) || isBefore(date, customEndDate))
    )
  }

  const isDateSelected = (date: Date) => {
    return (
      (customStartDate && isSameDay(date, customStartDate)) ||
      (customEndDate && isSameDay(date, customEndDate))
    )
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#262626] rounded-lg',
          'text-white text-sm hover:border-[#333] transition-colors',
          className
        )}
      >
        <Calendar className="w-4 h-4 text-[#808080]" />
        <span>{value.label}</span>
        <ChevronDown className={cn('w-4 h-4 text-[#808080] transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-[#262626] rounded-xl shadow-xl z-20 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#262626]">
              <button
                onClick={() => {
                  setActiveTab('presets')
                  // Reset custom dates when switching to presets
                  if (!isCustomRange) {
                    setCustomStartDate(null)
                    setCustomEndDate(null)
                  }
                }}
                className={cn(
                  'flex-1 px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === 'presets'
                    ? 'text-[#07F0FF] border-b-2 border-[#07F0FF]'
                    : 'text-[#808080] hover:text-white'
                )}
              >
                Presets
              </button>
              <button
                onClick={() => {
                  setActiveTab('custom')
                  // Initialize with current value if custom, or reset
                  if (isCustomRange) {
                    setCustomStartDate(value.startDate)
                    setCustomEndDate(value.endDate)
                    setCurrentMonth(value.startDate)
                  } else {
                    setCustomStartDate(null)
                    setCustomEndDate(null)
                  }
                }}
                className={cn(
                  'flex-1 px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === 'custom'
                    ? 'text-[#07F0FF] border-b-2 border-[#07F0FF]'
                    : 'text-[#808080] hover:text-white'
                )}
              >
                Personnalisé
              </button>
            </div>

            {activeTab === 'presets' && (
              <div className="w-64 max-h-80 overflow-y-auto">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetSelect(preset)}
                    className={cn(
                      'w-full px-4 py-3 text-left text-sm hover:bg-[#262626] transition-colors',
                      value.label === preset.label ? 'text-[#07F0FF] bg-[#262626]' : 'text-white'
                    )}
                  >
                    <span className="block font-medium">{preset.label}</span>
                    <span className="text-[#808080] text-xs">
                      {format(preset.startDate, 'd MMM', { locale: dateLocale })} - {format(preset.endDate, 'd MMM yyyy', { locale: dateLocale })}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="p-4 w-80">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCurrentMonth(subMonth(currentMonth, 1))}
                    className="p-1 hover:bg-[#262626] rounded text-white"
                  >
                    ←
                  </button>
                  <span className="text-white font-medium">
                    {format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}
                  </span>
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-1 hover:bg-[#262626] rounded text-white"
                  >
                    →
                  </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                    <div key={i} className="text-center text-[#808080] text-xs font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {getCalendarDays().map((date, i) => {
                    const isCurrentMonth = isSameMonth(date, currentMonth)
                    const inRange = isDateInRange(date)
                    const isSelected = isDateSelected(date)
                    const isToday = isSameDay(date, new Date())

                    return (
                      <button
                        key={i}
                        onClick={() => handleCustomDateClick(date)}
                        className={cn(
                          'h-9 text-sm rounded transition-colors',
                          !isCurrentMonth && 'text-[#404040]',
                          isCurrentMonth && 'text-white hover:bg-[#262626]',
                          inRange && 'bg-[#07F0FF]/20',
                          isSelected && 'bg-[#07F0FF] text-white font-semibold',
                          isToday && !isSelected && 'border border-[#07F0FF]'
                        )}
                      >
                        {format(date, 'd')}
                      </button>
                    )
                  })}
                </div>

                {/* Selected Range Display */}
                {(customStartDate || customEndDate) && (
                  <div className="mt-4 pt-4 border-t border-[#262626]">
                    <div className="text-xs text-[#808080] mb-2">
                      {customStartDate && (
                        <div>{t('dateRange.from')}: {format(customStartDate, 'd MMM yyyy', { locale: dateLocale })}</div>
                      )}
                      {customEndDate && (
                        <div>{t('dateRange.to')}: {format(customEndDate, 'd MMM yyyy', { locale: dateLocale })}</div>
                      )}
                    </div>
                    <button
                      onClick={handleCustomRangeApply}
                      disabled={!customStartDate || !customEndDate}
                      className={cn(
                        'w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        customStartDate && customEndDate
                          ? 'bg-[#07F0FF] text-white hover:bg-[#06D9E8]'
                          : 'bg-[#262626] text-[#808080] cursor-not-allowed'
                      )}
                    >
                      {t('common.apply')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export function useDateRange(defaultPreset = 0) {
  const { t } = useI18n()
  const presets = useMemo(() => getPresets(t), [t])
  
  // Load saved date range from localStorage
  const [dateRange, setDateRangeState] = useState<DateRange | null>(null)
  
  // Initialize date range from localStorage or default preset
  useEffect(() => {
    if (dateRange === null && typeof window !== 'undefined') {
      const saved = localStorage.getItem('dateRange')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setDateRangeState({
            startDate: new Date(parsed.startDate),
            endDate: new Date(parsed.endDate),
            label: parsed.label,
          })
          return
        } catch (e) {
          // If parsing fails, use default preset
        }
      }
      // Use default preset if nothing saved
      setDateRangeState(presets[defaultPreset])
    }
  }, [dateRange, presets, defaultPreset])

  // Save date range to localStorage whenever it changes
  const setDateRange = (newRange: DateRange) => {
    setDateRangeState(newRange)
    if (typeof window !== 'undefined') {
      localStorage.setItem('dateRange', JSON.stringify({
        startDate: newRange.startDate.toISOString(),
        endDate: newRange.endDate.toISOString(),
        label: newRange.label,
      }))
    }
  }

  // Return default if dateRange is not yet initialized
  const currentDateRange = dateRange || presets[defaultPreset]

  return {
    dateRange: currentDateRange,
    setDateRange,
    startDate: format(currentDateRange.startDate, 'yyyy-MM-dd'),
    endDate: format(currentDateRange.endDate, 'yyyy-MM-dd'),
  }
}

// Note: datePresets is now a function that requires t
export { getPresets }
