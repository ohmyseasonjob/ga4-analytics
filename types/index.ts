// Dashboard data types

export interface KPIData {
  label: string
  value: number | string
  change?: number
  changeLabel?: string
  source?: 'GA4' | 'Meta' | 'Google Ads' | 'Contentsquare'
  format?: 'number' | 'percent' | 'currency' | 'duration'
}

export interface LandingPagePerformance {
  page: string
  sessions: number
  ctaClicks: number
  conversionRate: number
}

export interface FunnelStep {
  name: string
  value: number
  percentage: number
}

export interface TrackingSource {
  name: string
  id: string
  status: 'active' | 'partial' | 'inactive'
  details: string
}

// GA4 Types
export interface GA4Event {
  eventName: string
  count: number
  percentage?: number
}

export interface GA4Source {
  source: string
  medium: string
  sessions: number
  users: number
}

export interface CTAPosition {
  position: string
  clicks: number
  percentage: number
}

export interface SectionView {
  section: string
  views: number
}

export interface ScrollDepth {
  depth: string
  count: number
  percentage: number
}

export interface TimeOnPage {
  bucket: string
  count: number
  percentage: number
}

export interface FAQInteraction {
  question: string
  clicks: number
}

// Meta Ads Types
export interface MetaCampaign {
  name: string
  spend: number
  impressions: number
  reach: number
  clicks: number
  ctr: number
  cpc: number
  cpm: number
}

export interface MetaCreative {
  rank: number
  name: string
  format: string
  ctr: number
  cpc: number
  clicks: number
}

export interface MetaAudience {
  name: string
  age: string
  ctr: number
  cpc: number
  clicks: number
}

export interface MetaPlacement {
  name: string
  percentage: number
  ctr: number
}

// Google Ads Types
export interface GoogleAdsCampaign {
  name: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  conversions: number
  costPerConversion: number
}

export interface GoogleAdsKeyword {
  keyword: string
  matchType: string
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  qualityScore: number
}

// Contentsquare Types
export interface CSZoneAttention {
  zone: string
  percentage: number
  color: string
}

export interface CSInsight {
  text: string
  type: 'warning' | 'info' | 'success'
}

// Date Range
export interface DateRange {
  startDate: Date
  endDate: Date
  compareStartDate?: Date
  compareEndDate?: Date
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T
  error?: string
  loading?: boolean
}
