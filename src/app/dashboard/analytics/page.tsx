'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HeatmapChart } from '@/components/dashboard/HeatmapChart'
import { FunnelChart } from '@/components/dashboard/FunnelChart'
import { TrendLineChart } from '@/components/dashboard/TrendLineChart'
import { VendorBarChart } from '@/components/dashboard/VendorBarChart'
import { useHeatmap, useFunnel, useTrends, useVendors, useMetrics } from '@/lib/hooks/useMetrics'
import { formatNumber, formatPercent } from '@/lib/utils/formatters'

export default function AnalyticsPage() {
  const { data: metrics, isLoading: metricsLoading } = useMetrics()
  const { data: heatmap, isLoading: heatmapLoading } = useHeatmap()
  const { data: funnel, isLoading: funnelLoading } = useFunnel()
  const { data: trends, isLoading: trendsLoading } = useTrends('daily')
  const { data: vendors, isLoading: vendorsLoading } = useVendors(1, 20)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500">
          Detailed insights into your campaign performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Total Contacted</p>
            <p className="text-3xl font-bold">
              {metricsLoading ? '-' : formatNumber(metrics?.totalContacted || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Total Reconnected</p>
            <p className="text-3xl font-bold text-green-600">
              {metricsLoading ? '-' : formatNumber(metrics?.totalReconnected || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Reconnection Rate</p>
            <p className="text-3xl font-bold text-blue-600">
              {metricsLoading ? '-' : formatPercent(metrics?.reconnectionRate || 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Overall Conversion</p>
            <p className="text-3xl font-bold text-purple-600">
              {funnelLoading ? '-' : formatPercent(funnel?.overallConversionRate || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="timing">Optimal Timing</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-4">
          <FunnelChart
            stages={funnel?.stages || []}
            loading={funnelLoading}
            title="Prospect Journey Funnel"
          />
          <Card>
            <CardHeader>
              <CardTitle>Funnel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {funnel?.stages.map((stage, index) => (
                  <div key={stage.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="font-medium">{stage.name}</span>
                    </div>
                    <p className="text-2xl font-bold">{formatNumber(stage.count)}</p>
                    <p className="text-sm text-gray-500">
                      {formatPercent(stage.percentage)} of total
                    </p>
                    {index > 0 && (
                      <p className="text-sm text-gray-400 mt-1">
                        {formatPercent(stage.conversionRate)} from previous
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing">
          <HeatmapChart
            data={heatmap?.grid || []}
            loading={heatmapLoading}
            title="Best Time to Contact (Response Rate by Day & Hour)"
          />
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Timing Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">Best Response Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPercent(heatmap?.maxValue || 0)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">Average Response Rate</p>
                  <p className="text-2xl font-bold">
                    {formatPercent(heatmap?.averageValue || 0)}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">Lowest Response Rate</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatPercent(heatmap?.minValue || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <TrendLineChart
            data={trends}
            loading={trendsLoading}
            title="30-Day Performance Trends"
          />
        </TabsContent>

        <TabsContent value="vendors">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VendorBarChart
              data={vendors}
              loading={vendorsLoading}
              title="By Reconnection Rate"
              metric="reconnectionRate"
            />
            <VendorBarChart
              data={vendors}
              loading={vendorsLoading}
              title="By Total Responses"
              metric="totalResponses"
            />
          </div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Vendor Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors.slice(0, 5).map((vendor, index) => (
                  <div
                    key={vendor.vendorId}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-300">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{vendor.vendorName}</p>
                        <p className="text-sm text-gray-500">{vendor.vendorEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        {formatPercent(vendor.reconnectionRate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {vendor.totalResponses} responses / {vendor.totalProspects} prospects
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
