// Dashboard-specific types

export interface KPIData {
  totalContacted: number
  totalCallbacks: number
  totalSmsResponses: number
  totalReconnected: number
  reconnectionRate: number
  trends?: {
    contactedChange: number
    callbacksChange: number
    smsResponsesChange: number
    reconnectedChange: number
    rateChange: number
  }
}

export interface HeatmapCell {
  day: number // 0-6 (Monday-Sunday)
  hour: number // 0-23
  value: number // Response rate percentage
  contacts: number
  responses: number
  label: string
}

export interface HeatmapData {
  grid: HeatmapCell[]
  maxValue: number
  minValue: number
  averageValue: number
}

export interface FunnelStage {
  id: string
  name: string
  count: number
  percentage: number
  conversionRate: number
  color: string
}

export interface FunnelData {
  stages: FunnelStage[]
  overallConversionRate: number
}

export interface TrendDataPoint {
  date: string
  contacts: number
  callbacks: number
  smsResponses: number
  reconnected: number
  reconnectionRate: number
}

export interface Campaign {
  id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'paused'
  startDate: string
  endDate?: string
  totalProspects: number
  contactedCount: number
  responseCount: number
  qualifiedCount: number
}

export interface VendorPerformance {
  vendorId: string
  vendorName: string
  vendorEmail: string
  totalProspects: number
  totalResponses: number
  callbacks: number
  interestedProspects: number
  reconnectionRate: number
}

export interface ConversationMessage {
  id: string
  direction: 'inbound' | 'outbound'
  content: string
  timestamp: string
  status?: string
}

export interface ProspectConversation {
  prospectId: string
  prospectName: string
  company?: string
  phone: string
  language: 'nl' | 'fr'
  qualificationStatus?: string
  messages: ConversationMessage[]
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    lastUpdated?: string
  }
}

// Campaign trigger request
export interface TriggerCampaignRequest {
  campaignName: string
  batchSize: number
  maxProspects?: number
  filters?: {
    language?: 'nl' | 'fr'
    categoryIds?: number[]
    vendorId?: string
  }
}
