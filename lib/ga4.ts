import type { 
  KPIData, 
  GA4Event, 
  CTAPosition, 
  SectionView, 
  ScrollDepth,
  TimeOnPage,
  FAQInteraction,
  GA4Source 
} from '@/types'

// Note: This file is currently unused - app/api/ga4/route.ts uses REST API directly
// If you need to use these functions, they should be migrated to use REST API like route.ts
// For now, keeping the structure but using REST API for compatibility

const propertyId = process.env.GA4_PROPERTY_ID || 'properties/0'

// Helper function to call GA4 REST API
async function runGA4Report(accessToken: string, body: object) {
  const propId = propertyId.replace('properties/', '')
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propId}:runReport`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`GA4 API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  return response.json()
}

export async function getGA4Overview(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<KPIData[]> {
  const response = await runGA4Report(accessToken, {
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
    ],
  })

  const row = response.rows?.[0]?.metricValues || []

  return [
    {
      label: 'Sessions',
      value: parseInt(row[0]?.value || '0'),
      source: 'GA4',
      format: 'number',
    },
    {
      label: 'Utilisateurs',
      value: parseInt(row[1]?.value || '0'),
      source: 'GA4',
      format: 'number',
    },
    {
      label: 'Pages/Session',
      value: parseFloat(row[2]?.value || '0') / parseInt(row[0]?.value || '1'),
      source: 'GA4',
      format: 'number',
    },
    {
      label: 'Durée moy',
      value: parseFloat(row[3]?.value || '0'),
      source: 'GA4',
      format: 'duration',
    },
    {
      label: 'Taux rebond',
      value: parseFloat(row[4]?.value || '0') * 100,
      source: 'GA4',
      format: 'percent',
    },
  ]
}

export async function getCTAClicks(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<number> {
  const response = await runGA4Report(accessToken, {
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: { value: 'cta_click' },
      },
    },
  })

  return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0')
}

export async function getCalendlyScheduled(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<number> {
  const response = await runGA4Report(accessToken, {
    dateRanges: [{ startDate, endDate }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: { value: 'calendly_scheduled' },
      },
    },
  })

  return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0')
}

export async function getCTAByPosition(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<CTAPosition[]> {
  const response = await runGA4Report(accessToken, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'customEvent:cta_location' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: { value: 'cta_click' },
      },
    },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
  })

  const total = (response.rows || []).reduce(
    (sum: number, row: any) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
    0
  ) || 1

  return (response.rows || []).map((row: any) => ({
    position: row.dimensionValues?.[0]?.value || 'unknown',
    clicks: parseInt(row.metricValues?.[0]?.value || '0'),
    percentage: (parseInt(row.metricValues?.[0]?.value || '0') / total) * 100,
  }))
}

export async function getSectionViews(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<SectionView[]> {
  const response = await runGA4Report(accessToken, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'customEvent:section_name' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: { value: 'section_view' },
      },
    },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
  })

  return (response.rows || []).map((row: any) => ({
    section: row.dimensionValues?.[0]?.value || 'unknown',
    views: parseInt(row.metricValues?.[0]?.value || '0'),
  }))
}

export async function getScrollDepth(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<ScrollDepth[]> {
  const response = await runGA4Report(accessToken, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'customEvent:scroll_threshold' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: { value: 'scroll_depth' },
      },
    },
  })

  const total = (response.rows || []).reduce(
    (sum: number, row: any) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
    0
  ) || 1

  return (response.rows || []).map((row: any) => ({
    depth: `Scroll ${row.dimensionValues?.[0]?.value || '0'}%`,
    count: parseInt(row.metricValues?.[0]?.value || '0'),
    percentage: (parseInt(row.metricValues?.[0]?.value || '0') / total) * 100,
  }))
}

export async function getSourceMedium(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<GA4Source[]> {
  const response = await runGA4Report(accessToken, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'sessionSource' },
      { name: 'sessionMedium' },
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  })

  return (response.rows || []).map((row: any) => ({
    source: row.dimensionValues?.[0]?.value || '(direct)',
    medium: row.dimensionValues?.[1]?.value || '(none)',
    sessions: parseInt(row.metricValues?.[0]?.value || '0'),
    users: parseInt(row.metricValues?.[1]?.value || '0'),
  }))
}

export async function getLandingPagePerformance(
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const response = await runGA4Report(accessToken, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'landingPage' }],
    metrics: [
      { name: 'sessions' },
      { name: 'eventCount' },
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'landingPage',
        stringFilter: {
          matchType: 'CONTAINS',
          value: '/lp',
        },
      },
    },
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  })

  return (response.rows || []).map((row: any) => {
    const sessions = parseInt(row.metricValues?.[0]?.value || '0')
    const events = parseInt(row.metricValues?.[1]?.value || '0')
    return {
      page: row.dimensionValues?.[0]?.value || 'unknown',
      sessions,
      ctaClicks: events,
      conversionRate: sessions > 0 ? (events / sessions) * 100 : 0,
    }
  })
}
