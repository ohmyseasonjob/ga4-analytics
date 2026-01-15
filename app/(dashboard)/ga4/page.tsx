'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { KPICard } from '@/components/ui/kpi-card'
import { DataTable } from '@/components/ui/data-table'
import { SimpleChart } from '@/components/ui/simple-chart'
import { DateRangePicker, useDateRange } from '@/components/ui/date-range-picker'
import { useI18n } from '@/lib/i18n'
import { 
  BarChart3, 
  MousePointerClick, 
  Clock, 
  TrendingDown,
  Smartphone,
  Monitor,
  Tablet,
  Loader2
} from 'lucide-react'

// Types
interface GA4Data {
  kpis: {
    sessions: number
    sessionsChange: number
    ctaClicks: number
    ctaClicksChange: number
    avgTimeOnPage: string
    avgTimeChange: number
    bounceRate: number
    bounceRateChange: number
  }
  sources: Array<{
    source: string
    sessions: number
    users: number
    ctaClicks: number
    conversionRate: string
  }>
  ctaPositions: Array<{
    position: string
    clicks: number
    percentage: string
    conversionRate: string
  }>
  devices: Array<{
    device: string
    sessions: number
    percentage: string
    bounceRate: string
  }>
  dailyData: Array<{
    date: string
    sessions: number
    ctaClicks: number
  }>
  scrollDepth: Array<{
    depth: string
    users: number
    percentage: string
  }>
  timeOnPage: Array<{
    range: string
    users: number
    percentage: string
  }>
  sectionViews: Array<{
    section: string
    views: number
    percentage: string
  }>
}

// Mock data fallback
const mockData: GA4Data = {
  kpis: {
    sessions: 2847,
    sessionsChange: 12.4,
    ctaClicks: 347,
    ctaClicksChange: 24.6,
    avgTimeOnPage: '2:34',
    avgTimeChange: 8.2,
    bounceRate: 42,
    bounceRateChange: -5.3
  },
  sources: [
    { source: 'google / organic', sessions: 1234, users: 987, ctaClicks: 89, conversionRate: '7.2%' },
    { source: 'facebook / paid', sessions: 567, users: 456, ctaClicks: 67, conversionRate: '11.8%' },
    { source: 'direct / (none)', sessions: 423, users: 345, ctaClicks: 45, conversionRate: '10.6%' },
    { source: 'linkedin / social', sessions: 234, users: 189, ctaClicks: 23, conversionRate: '9.8%' },
    { source: 'google / cpc', sessions: 189, users: 156, ctaClicks: 18, conversionRate: '9.5%' },
  ],
  ctaPositions: [
    { position: 'Hero', clicks: 156, percentage: '45%', conversionRate: '8.2%' },
    { position: 'Sticky Bottom', clicks: 98, percentage: '28%', conversionRate: '7.1%' },
    { position: 'Section CTA', clicks: 67, percentage: '19%', conversionRate: '5.4%' },
    { position: 'Nav', clicks: 26, percentage: '8%', conversionRate: '3.2%' },
  ],
  devices: [
    { device: 'Mobile', sessions: 1594, percentage: '56%', bounceRate: '45%' },
    { device: 'Desktop', sessions: 1064, percentage: '37%', bounceRate: '38%' },
    { device: 'Tablet', sessions: 189, percentage: '7%', bounceRate: '41%' },
  ],
  dailyData: [
    { date: '07/01', sessions: 378, ctaClicks: 42 },
    { date: '08/01', sessions: 412, ctaClicks: 48 },
    { date: '09/01', sessions: 389, ctaClicks: 51 },
    { date: '10/01', sessions: 456, ctaClicks: 58 },
    { date: '11/01', sessions: 423, ctaClicks: 52 },
    { date: '12/01', sessions: 398, ctaClicks: 47 },
    { date: '13/01', sessions: 391, ctaClicks: 49 },
  ],
  scrollDepth: [
    { depth: '25%', users: 2456, percentage: '86%' },
    { depth: '50%', users: 1987, percentage: '70%' },
    { depth: '75%', users: 1234, percentage: '43%' },
    { depth: '100%', users: 678, percentage: '24%' },
  ],
  timeOnPage: [
    { range: '0-30s', users: 567, percentage: '20%' },
    { range: '30s-1m', users: 823, percentage: '29%' },
    { range: '1-2m', users: 945, percentage: '33%' },
    { range: '2-5m', users: 398, percentage: '14%' },
    { range: '5m+', users: 114, percentage: '4%' },
  ],
  sectionViews: [
    { section: 'Hero', views: 2456, percentage: '100%' },
    { section: 'Bénéfices', views: 1987, percentage: '81%' },
    { section: 'Comment ça marche', views: 1456, percentage: '59%' },
    { section: 'Témoignages', views: 987, percentage: '40%' },
    { section: 'Tarifs', views: 756, percentage: '31%' },
    { section: 'FAQ', views: 534, percentage: '22%' },
  ],
}

// Device icon helper
const getDeviceIcon = (device: string) => {
  switch (device.toLowerCase()) {
    case 'mobile': return <Smartphone className="w-4 h-4" />
    case 'desktop': return <Monitor className="w-4 h-4" />
    case 'tablet': return <Tablet className="w-4 h-4" />
    default: return <Monitor className="w-4 h-4" />
  }
}

export default function GA4Page() {
  const { data: session, status } = useSession()
  const { dateRange, setDateRange, startDate, endDate } = useDateRange(0)
  const { t } = useI18n()
  const [data, setData] = useState<GA4Data>(mockData)
  const [isLiveData, setIsLiveData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGA4Data = async () => {
      // Si pas authentifié, utiliser mock data
      if (status === 'unauthenticated') {
        setData(mockData)
        setIsLiveData(false)
        setIsLoading(false)
        return
      }

      // Si loading, attendre
      if (status === 'loading') {
        return
      }

      // Authentifié → fetch real data
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/ga4?startDate=${startDate}&endDate=${endDate}`)
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const result = await response.json()

        if (result.error) {
          throw new Error(result.error)
        }

        // Transformer les données API en format attendu
        const transformedData: GA4Data = {
          kpis: {
            sessions: result.kpis?.sessions || mockData.kpis.sessions,
            sessionsChange: result.kpis?.sessionsChange || mockData.kpis.sessionsChange,
            ctaClicks: result.kpis?.ctaClicks || mockData.kpis.ctaClicks,
            ctaClicksChange: result.kpis?.ctaClicksChange || mockData.kpis.ctaClicksChange,
            avgTimeOnPage: result.kpis?.avgTimeOnPage || mockData.kpis.avgTimeOnPage,
            avgTimeChange: result.kpis?.avgTimeChange || mockData.kpis.avgTimeChange,
            bounceRate: result.kpis?.bounceRate || mockData.kpis.bounceRate,
            bounceRateChange: result.kpis?.bounceRateChange || mockData.kpis.bounceRateChange,
          },
          sources: result.sources || mockData.sources,
          ctaPositions: result.ctaPositions || mockData.ctaPositions,
          devices: result.devices || mockData.devices,
          dailyData: result.dailyData || mockData.dailyData,
          scrollDepth: result.scrollDepth || mockData.scrollDepth,
          timeOnPage: result.timeOnPage || mockData.timeOnPage,
          sectionViews: result.sectionViews || mockData.sectionViews,
        }

        setData(transformedData)
        setIsLiveData(true)
      } catch (err) {
        console.error('Failed to fetch GA4 data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setData(mockData)
        setIsLiveData(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGA4Data()
  }, [status, startDate, endDate])

  // Table columns definitions
  const sourceColumns = [
    { key: 'source', header: t('ga4.sourceMedium') },
    { key: 'sessions', header: t('ga4.sessions'), align: 'right' as const },
    { key: 'users', header: t('ga4.users'), align: 'right' as const },
    { key: 'ctaClicks', header: t('ga4.ctaClicks'), align: 'right' as const },
    { key: 'conversionRate', header: t('ga4.convRate'), align: 'right' as const },
  ]

  const ctaColumns = [
    { key: 'position', header: t('ga4.position') },
    { key: 'clicks', header: t('ga4.clicks'), align: 'right' as const },
    { key: 'percentage', header: t('ga4.percentTotal'), align: 'right' as const },
    { key: 'conversionRate', header: t('ga4.convRate'), align: 'right' as const },
  ]

  const deviceColumns = [
    { 
      key: 'device', 
      header: t('ga4.device'),
      render: (value: string) => (
        <div className="flex items-center gap-2">
          {getDeviceIcon(value)}
          <span>{value}</span>
        </div>
      )
    },
    { key: 'sessions', header: t('ga4.sessions'), align: 'right' as const },
    { key: 'percentage', header: t('ga4.percentTotal'), align: 'right' as const },
    { key: 'bounceRate', header: t('ga4.bounceRate'), align: 'right' as const },
  ]

  const scrollColumns = [
    { key: 'depth', header: t('ga4.depth') },
    { key: 'users', header: t('ga4.users'), align: 'right' as const },
    { key: 'percentage', header: t('ga4.percentTotal'), align: 'right' as const },
  ]

  const timeColumns = [
    { key: 'range', header: t('ga4.timeRange') },
    { key: 'users', header: t('ga4.users'), align: 'right' as const },
    { key: 'percentage', header: t('ga4.percentTotal'), align: 'right' as const },
  ]

  const sectionColumns = [
    { key: 'section', header: t('ga4.section') },
    { key: 'views', header: t('ga4.views'), align: 'right' as const },
    { key: 'percentage', header: t('ga4.percentTotal'), align: 'right' as const },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('ga4.title')}</h1>
          <p className="text-[#808080] mt-1">
            {t('ga4.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#262626] text-[#808080]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-xs font-medium">{t('common.loading')}</span>
            </div>
          ) : (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              isLiveData 
                ? 'bg-[#50F172]/10 text-[#50F172]' 
                : 'bg-[#F1C40F]/10 text-[#F1C40F]'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isLiveData ? 'bg-[#50F172] animate-pulse' : 'bg-[#F1C40F]'
              }`} />
              <span className="text-xs font-medium">
                {isLiveData ? t('common.liveData') : t('common.mockData')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-[#E74C3C]/10 border border-[#E74C3C]/20 rounded-lg p-4">
          <p className="text-[#E74C3C] text-sm">
            <strong>{t('ga4.apiError')}</strong> {error}
          </p>
          <p className="text-[#808080] text-xs mt-1">
            {t('ga4.displayingDemo')}
          </p>
        </div>
      )}

      {/* Auth hint */}
      {!session && status !== 'loading' && (
        <div className="bg-[#07F0FF]/10 border border-[#07F0FF]/20 rounded-lg p-4">
          <p className="text-[#07F0FF] text-sm">
            {t('ga4.connectGoogle')}
          </p>
        </div>
      )}

      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t('ga4.sessions')}
          value={data.kpis.sessions.toLocaleString()}
          change={data.kpis.sessionsChange}
          icon={<BarChart3 className="w-5 h-5" />}
          subtitle={dateRange.label}
        />
        <KPICard
          title={t('ga4.ctaClicks')}
          value={data.kpis.ctaClicks.toLocaleString()}
          change={data.kpis.ctaClicksChange}
          icon={<MousePointerClick className="w-5 h-5" />}
          subtitle={t('ga4.eventCtaClick')}
        />
        <KPICard
          title={t('ga4.avgTime')}
          value={data.kpis.avgTimeOnPage}
          change={data.kpis.avgTimeChange}
          icon={<Clock className="w-5 h-5" />}
          subtitle={t('ga4.onPage')}
        />
        <KPICard
          title={t('ga4.bounceRate')}
          value={`${data.kpis.bounceRate}%`}
          change={data.kpis.bounceRateChange}
          icon={<TrendingDown className="w-5 h-5" />}
          subtitle={t('ga4.objective')}
          invertChange
        />
      </div>

      {/* Chart + Sources Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SimpleChart
            data={data.dailyData}
            title={t('ga4.sessionsAndCtaClicks')}
            subtitle={dateRange.label}
            lines={[
              { dataKey: 'sessions', color: '#50F172', name: t('ga4.sessions') },
              { dataKey: 'ctaClicks', color: '#07F0FF', name: t('ga4.ctaClicks') },
            ]}
            xAxisKey="date"
          />
        </div>
        <DataTable
          columns={deviceColumns}
          data={data.devices}
          title={t('ga4.devices')}
          subtitle={t('ga4.trafficDistribution')}
        />
      </div>

      {/* Sources Table */}
      <DataTable
        columns={sourceColumns}
        data={data.sources}
        title={t('ga4.trafficSources')}
        subtitle={t('ga4.acquisitionChannel')}
      />

      {/* CTA Positions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          columns={ctaColumns}
          data={data.ctaPositions}
          title={t('ga4.ctaPositions')}
          subtitle={t('ga4.ctaByLocation')}
        />
        <div className="bg-[#1a1a1a] rounded-xl border border-[#262626] p-6">
          <h3 className="text-white font-semibold mb-4">{t('ga4.insights')}</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#50F172] mt-2" />
              <div>
                <p className="text-white text-sm font-medium">{t('ga4.hero45Percent')}</p>
                <p className="text-[#808080] text-xs">{t('ga4.bestPosition')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#07F0FF] mt-2" />
              <div>
                <p className="text-white text-sm font-medium">{t('ga4.stickyBottomEffective')}</p>
                <p className="text-[#808080] text-xs">{t('ga4.goodConversion')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#F1C40F] mt-2" />
              <div>
                <p className="text-white text-sm font-medium">{t('ga4.navUnderperforms')}</p>
                <p className="text-[#808080] text-xs">{t('ga4.lowConversion')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics Row - FAQ remplacé par Section Views */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DataTable
          columns={scrollColumns}
          data={data.scrollDepth}
          title={t('ga4.scrollDepth')}
          subtitle="Event: scroll_depth"
        />
        <DataTable
          columns={timeColumns}
          data={data.timeOnPage}
          title={t('ga4.timeOnPage')}
          subtitle="Event: time_on_page"
        />
        <DataTable
          columns={sectionColumns}
          data={data.sectionViews}
          title={t('ga4.sectionViews')}
          subtitle="Event: section_view"
        />
      </div>
    </div>
  )
}