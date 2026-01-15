import type { GoogleAdsCampaign, GoogleAdsKeyword, KPIData } from '@/types'

const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID || '0'
const DEVELOPER_TOKEN = process.env.GOOGLE_ADS_DEVELOPER_TOKEN || ''

interface GoogleAdsMetrics {
  impressions?: string
  clicks?: string
  costMicros?: string
  conversions?: string
  ctr?: string
  averageCpc?: string
  costPerConversion?: string
}

interface GoogleAdsResponse {
  results: Array<{
    campaign?: { name: string; id: string }
    adGroupCriterion?: {
      keyword?: { text: string; matchType: string }
      qualityInfo?: { qualityScore: number }
    }
    metrics?: GoogleAdsMetrics
    userList?: {
      name?: string
      sizeForDisplay?: string
      membershipLifeSpan?: number
    }
  }>
}

async function googleAdsQuery(
  query: string,
  accessToken: string
): Promise<GoogleAdsResponse> {
  const response = await fetch(
    `https://googleads.googleapis.com/v15/customers/${CUSTOMER_ID}/googleAds:search`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': DEVELOPER_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    }
  )

  if (!response.ok) {
    throw new Error(`Google Ads API error: ${response.statusText}`)
  }

  return response.json()
}

export async function getGoogleAdsOverview(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<KPIData[]> {
  const query = `
    SELECT
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.ctr,
      metrics.average_cpc
    FROM customer
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
  `

  const response = await googleAdsQuery(query, accessToken)
  const metrics: GoogleAdsMetrics = response.results[0]?.metrics || {}

  const costMicros = parseInt(metrics.costMicros || '0')
  const cost = costMicros / 1000000

  return [
    {
      label: 'Dépense',
      value: cost,
      source: 'Google Ads',
      format: 'currency',
    },
    {
      label: 'Impressions',
      value: parseInt(metrics.impressions || '0'),
      source: 'Google Ads',
      format: 'number',
    },
    {
      label: 'Clics',
      value: parseInt(metrics.clicks || '0'),
      source: 'Google Ads',
      format: 'number',
    },
    {
      label: 'CTR',
      value: parseFloat(metrics.ctr || '0') * 100,
      source: 'Google Ads',
      format: 'percent',
    },
    {
      label: 'CPC moyen',
      value: parseInt(metrics.averageCpc || '0') / 1000000,
      source: 'Google Ads',
      format: 'currency',
    },
  ]
}

export async function getGoogleAdsCampaigns(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<GoogleAdsCampaign[]> {
  const query = `
    SELECT
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.ctr,
      metrics.average_cpc,
      metrics.cost_per_conversion
    FROM campaign
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
      AND campaign.status = 'ENABLED'
    ORDER BY metrics.cost_micros DESC
    LIMIT 20
  `

  const response = await googleAdsQuery(query, accessToken)

  return response.results.map((row) => {
    const metrics: GoogleAdsMetrics = row.metrics || {}
    const costMicros = parseInt(metrics.costMicros || '0')
    
    return {
      name: row.campaign?.name || 'Unknown',
      spend: costMicros / 1000000,
      impressions: parseInt(metrics.impressions || '0'),
      clicks: parseInt(metrics.clicks || '0'),
      ctr: parseFloat(metrics.ctr || '0') * 100,
      cpc: parseInt(metrics.averageCpc || '0') / 1000000,
      conversions: parseFloat(metrics.conversions || '0'),
      costPerConversion: parseInt(metrics.costPerConversion || '0') / 1000000,
    }
  })
}

export async function getGoogleAdsKeywords(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<GoogleAdsKeyword[]> {
  const query = `
    SELECT
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.quality_info.quality_score,
      metrics.impressions,
      metrics.clicks,
      metrics.ctr,
      metrics.average_cpc
    FROM keyword_view
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
      AND ad_group_criterion.status = 'ENABLED'
    ORDER BY metrics.impressions DESC
    LIMIT 50
  `

  const response = await googleAdsQuery(query, accessToken)

  return response.results.map((row) => {
    const metrics: GoogleAdsMetrics = row.metrics || {}
    const keyword = row.adGroupCriterion?.keyword || {}
    const qualityInfo = row.adGroupCriterion?.qualityInfo || {}

    return {
      keyword: keyword.text || 'Unknown',
      matchType: keyword.matchType || 'UNKNOWN',
      impressions: parseInt(metrics.impressions || '0'),
      clicks: parseInt(metrics.clicks || '0'),
      ctr: parseFloat(metrics.ctr || '0') * 100,
      cpc: parseInt(metrics.averageCpc || '0') / 1000000,
      qualityScore: qualityInfo.qualityScore || 0,
    }
  })
}

export async function getRemarketingAudience(
  accessToken: string
): Promise<{ size: number; details: string[] }> {
  const query = `
    SELECT
      user_list.name,
      user_list.size_for_display,
      user_list.membership_life_span
    FROM user_list
    WHERE user_list.type = 'REMARKETING'
    LIMIT 10
  `

  try {
    const response = await googleAdsQuery(query, accessToken)
    
    const totalSize = response.results.reduce((sum: number, row) => {
      return sum + parseInt(row.userList?.sizeForDisplay || '0')
    }, 0)

    return {
      size: totalSize,
      details: [
        'Tous les visiteurs des 6 LP',
        'Durée de l\'audience: 30 jours',
        'Prêt pour campagnes Display/YouTube',
      ],
    }
  } catch {
    return {
      size: 0,
      details: ['Audience non configurée'],
    }
  }
}
