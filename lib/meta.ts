import type { MetaCampaign, MetaCreative, MetaAudience, MetaPlacement, KPIData } from '@/types'

const META_API_VERSION = 'v18.0'
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || 'act_0'

interface MetaApiResponse<T> {
  data: T[]
  paging?: {
    cursors: { before: string; after: string }
    next?: string
  }
}

async function metaFetch<T>(
  endpoint: string,
  accessToken: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/${endpoint}`)
  url.searchParams.append('access_token', accessToken)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Meta API error: ${response.statusText}`)
  }
  return response.json()
}

export async function getMetaOverview(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<KPIData[]> {
  const insights = await metaFetch<{
    data: Array<{
      spend: string
      impressions: string
      reach: string
      clicks: string
      cpc: string
      cpm: string
      ctr: string
    }>
  }>(`${AD_ACCOUNT_ID}/insights`, accessToken, {
    fields: 'spend,impressions,reach,clicks,cpc,cpm,ctr',
    time_range: JSON.stringify({
      since: startDate,
      until: endDate,
    }),
    level: 'account',
  })

  const data = insights.data[0] || {}

  return [
    {
      label: 'Dépense totale',
      value: parseFloat(data.spend || '0'),
      source: 'Meta',
      format: 'currency',
    },
    {
      label: 'Impressions',
      value: parseInt(data.impressions || '0'),
      source: 'Meta',
      format: 'number',
    },
    {
      label: 'Reach',
      value: parseInt(data.reach || '0'),
      source: 'Meta',
      format: 'number',
    },
    {
      label: 'Clics (link)',
      value: parseInt(data.clicks || '0'),
      source: 'Meta',
      format: 'number',
    },
    {
      label: 'CPC moyen',
      value: parseFloat(data.cpc || '0'),
      source: 'Meta',
      format: 'currency',
    },
  ]
}

export async function getMetaCampaigns(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<MetaCampaign[]> {
  const campaigns = await metaFetch<MetaApiResponse<{
    campaign_name: string
    spend: string
    impressions: string
    reach: string
    clicks: string
    ctr: string
    cpc: string
    cpm: string
  }>>(`${AD_ACCOUNT_ID}/insights`, accessToken, {
    fields: 'campaign_name,spend,impressions,reach,clicks,ctr,cpc,cpm',
    time_range: JSON.stringify({
      since: startDate,
      until: endDate,
    }),
    level: 'campaign',
    limit: '50',
  })

  return campaigns.data.map((c) => ({
    name: c.campaign_name,
    spend: parseFloat(c.spend || '0'),
    impressions: parseInt(c.impressions || '0'),
    reach: parseInt(c.reach || '0'),
    clicks: parseInt(c.clicks || '0'),
    ctr: parseFloat(c.ctr || '0'),
    cpc: parseFloat(c.cpc || '0'),
    cpm: parseFloat(c.cpm || '0'),
  }))
}

export async function getMetaCreatives(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<MetaCreative[]> {
  const ads = await metaFetch<MetaApiResponse<{
    ad_name: string
    creative: { id: string }
    spend: string
    impressions: string
    clicks: string
    ctr: string
    cpc: string
  }>>(`${AD_ACCOUNT_ID}/insights`, accessToken, {
    fields: 'ad_name,creative,spend,impressions,clicks,ctr,cpc',
    time_range: JSON.stringify({
      since: startDate,
      until: endDate,
    }),
    level: 'ad',
    sort: 'ctr_descending',
    limit: '10',
  })

  return ads.data.map((ad, index) => ({
    rank: index + 1,
    name: ad.ad_name,
    format: 'Unknown', // Would need additional API call to get format
    ctr: parseFloat(ad.ctr || '0'),
    cpc: parseFloat(ad.cpc || '0'),
    clicks: parseInt(ad.clicks || '0'),
  }))
}

export async function getMetaAudiences(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<MetaAudience[]> {
  const adsets = await metaFetch<MetaApiResponse<{
    adset_name: string
    spend: string
    clicks: string
    ctr: string
    cpc: string
    age: string
  }>>(`${AD_ACCOUNT_ID}/insights`, accessToken, {
    fields: 'adset_name,spend,clicks,ctr,cpc',
    breakdowns: 'age',
    time_range: JSON.stringify({
      since: startDate,
      until: endDate,
    }),
    level: 'adset',
    limit: '20',
  })

  return adsets.data.map((adset) => ({
    name: adset.adset_name,
    age: adset.age || 'Unknown',
    ctr: parseFloat(adset.ctr || '0'),
    cpc: parseFloat(adset.cpc || '0'),
    clicks: parseInt(adset.clicks || '0'),
  }))
}

export async function getMetaPlacements(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<MetaPlacement[]> {
  const placements = await metaFetch<MetaApiResponse<{
    publisher_platform: string
    impressions: string
    clicks: string
    ctr: string
  }>>(`${AD_ACCOUNT_ID}/insights`, accessToken, {
    fields: 'publisher_platform,impressions,clicks,ctr',
    breakdowns: 'publisher_platform',
    time_range: JSON.stringify({
      since: startDate,
      until: endDate,
    }),
    level: 'account',
  })

  const total = placements.data.reduce(
    (sum, p) => sum + parseInt(p.impressions || '0'),
    0
  ) || 1

  return placements.data.map((p) => ({
    name: p.publisher_platform,
    percentage: (parseInt(p.impressions || '0') / total) * 100,
    ctr: parseFloat(p.ctr || '0'),
  }))
}
