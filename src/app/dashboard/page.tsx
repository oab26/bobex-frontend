'use client'

import { MetricsHero } from '@/components/dashboard/MetricsHero'
import { TrendLineChart } from '@/components/dashboard/TrendLineChart'
import { ResponsePieChart } from '@/components/dashboard/ResponsePieChart'
import { VendorBarChart } from '@/components/dashboard/VendorBarChart'
import { CampaignTable } from '@/components/dashboard/CampaignTable'
import { StartCampaignDialog } from '@/components/dashboard/StartCampaignDialog'
import { useMetrics, useTrends, useCampaigns, useVendors } from '@/lib/hooks/useMetrics'
import { CHART_COLORS } from '@/lib/utils/constants'

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useMetrics()
  const { data: trends, isLoading: trendsLoading } = useTrends()
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns(1, 5)
  const { data: vendors, isLoading: vendorsLoading } = useVendors(1, 10)

  // Calculate response distribution for pie chart
  const responseDistribution = metrics
    ? [
        { name: 'SMS Responses', value: metrics.totalSmsResponses, color: CHART_COLORS.primary },
        { name: 'Interested', value: metrics.totalInterested || 0, color: CHART_COLORS.secondary },
        { name: 'Not Interested', value: metrics.totalNotInterested || 0, color: CHART_COLORS.danger },
        {
          name: 'No Response',
          value: Math.max(0, metrics.totalContacted - metrics.totalSmsResponses),
          color: '#e2e8f0',
        },
      ].filter(item => item.value > 0)
    : []

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Overview of your prospect re-engagement campaigns
          </p>
        </div>
        <StartCampaignDialog />
      </div>

      {/* KPI Cards */}
      <MetricsHero data={metrics || null} loading={metricsLoading} />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendLineChart
          data={trends}
          loading={trendsLoading}
          title="7-Day Trends"
        />
        <ResponsePieChart
          data={responseDistribution}
          loading={metricsLoading}
          title="Response Distribution"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VendorBarChart
          data={vendors}
          loading={vendorsLoading}
          title="Top Performing Vendors"
          metric="reconnectionRate"
        />
        <CampaignTable
          campaigns={campaigns}
          loading={campaignsLoading}
          title="Recent Campaigns"
        />
      </div>
    </div>
  )
}
