'use client'

import { KPICard } from './KPICard'
import {
  Users,
  MessageSquare,
  UserCheck,
  TrendingUp,
} from 'lucide-react'
import { KPIData } from '@/types/dashboard'

interface MetricsHeroProps {
  data: KPIData | null
  loading?: boolean
}

export function MetricsHero({ data, loading = false }: MetricsHeroProps) {
  const getTrend = (change: number | undefined) => {
    if (change === undefined) return undefined
    return {
      value: change,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      period: 'vs last week',
    } as const
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <KPICard
        title="Total Contacted"
        value={data?.totalContacted || 0}
        unit="prospects"
        trend={getTrend(data?.trends?.contactedChange)}
        icon={<Users className="h-5 w-5" />}
        color="blue"
        loading={loading}
      />
      <KPICard
        title="SMS Responses"
        value={data?.totalSmsResponses || 0}
        unit="messages"
        trend={getTrend(data?.trends?.smsResponsesChange)}
        icon={<MessageSquare className="h-5 w-5" />}
        color="amber"
        loading={loading}
      />
      <KPICard
        title="Reconnected"
        value={data?.totalReconnected || 0}
        unit="leads"
        trend={getTrend(data?.trends?.reconnectedChange)}
        icon={<UserCheck className="h-5 w-5" />}
        color="purple"
        loading={loading}
      />
      <KPICard
        title="Response Rate"
        value={data?.responseRate || 0}
        trend={getTrend(data?.trends?.rateChange)}
        icon={<TrendingUp className="h-5 w-5" />}
        color="green"
        loading={loading}
        isPercentage
      />
    </div>
  )
}
