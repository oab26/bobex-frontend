// Color palette for charts
export const CHART_COLORS = {
  primary: '#2563eb',
  secondary: '#16a34a',
  accent: '#f59e0b',
  danger: '#dc2626',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  pink: '#ec4899',
}

export const CHART_COLOR_ARRAY = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.purple,
  CHART_COLORS.pink,
  CHART_COLORS.cyan,
]

// Heatmap color scale
export const HEATMAP_COLORS = {
  none: '#f1f5f9',
  low: '#fee2e2',
  mediumLow: '#fef3c7',
  medium: '#fef9c3',
  mediumHigh: '#d9f99d',
  high: '#bbf7d0',
}

export function getHeatmapColor(value: number): string {
  if (value === 0) return HEATMAP_COLORS.none
  if (value < 10) return HEATMAP_COLORS.low
  if (value < 20) return HEATMAP_COLORS.mediumLow
  if (value < 30) return HEATMAP_COLORS.medium
  if (value < 40) return HEATMAP_COLORS.mediumHigh
  return HEATMAP_COLORS.high
}

// Funnel stage colors
export const FUNNEL_COLORS = {
  contacted: '#3b82f6',
  callback_sms: '#8b5cf6',
  responded: '#f59e0b',
  qualified: '#10b981',
  notified: '#059669',
}

// Day labels
export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const DAY_LABELS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Hour labels
export const HOUR_LABELS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, '0') + ':00'
)

// KPI configurations
export const KPI_CONFIGS = {
  totalContacted: {
    title: 'Total Contacted',
    unit: 'prospects',
    color: 'blue' as const,
    icon: 'Users',
  },
  totalSmsResponses: {
    title: 'SMS Responses',
    unit: 'messages',
    color: 'amber' as const,
    icon: 'MessageSquare',
  },
  totalReconnected: {
    title: 'Reconnected',
    unit: 'leads',
    color: 'purple' as const,
    icon: 'UserCheck',
  },
  responseRate: {
    title: 'Response Rate',
    unit: '%',
    color: 'green' as const,
    icon: 'TrendingUp',
  },
}

// Refresh intervals
export const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes
export const REALTIME_DEBOUNCE = 1000 // 1 second

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
