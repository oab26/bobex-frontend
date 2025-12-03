'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { VendorPerformance } from '@/types/dashboard'

interface VendorBarChartProps {
  data: VendorPerformance[]
  loading?: boolean
  title?: string
  metric?: 'reconnectionRate' | 'totalResponses' | 'interestedProspects'
}

export function VendorBarChart({
  data,
  loading = false,
  title = 'Top Vendors',
  metric = 'reconnectionRate',
}: VendorBarChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Sort and limit to top 10
  const sortedData = [...data]
    .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
    .slice(0, 10)
    .map(v => ({
      name: v.vendorName?.length > 15 ? v.vendorName.slice(0, 12) + '...' : v.vendorName,
      fullName: v.vendorName,
      value: v[metric] || 0,
      prospects: v.totalProspects,
      responses: v.totalResponses,
    }))

  const getMetricLabel = () => {
    switch (metric) {
      case 'reconnectionRate':
        return 'Reconnection Rate (%)'
      case 'totalResponses':
        return 'Total Responses'
      case 'interestedProspects':
        return 'Interested Leads'
      default:
        return 'Value'
    }
  }

  const formatValue = (value: number) => {
    if (metric === 'reconnectionRate') {
      return `${value.toFixed(1)}%`
    }
    return value.toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              tickFormatter={(value) =>
                metric === 'reconnectionRate' ? `${value}%` : value.toString()
              }
            />
            <YAxis
              dataKey="name"
              type="category"
              width={80}
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-white p-3 border rounded-lg shadow-lg">
                      <p className="font-medium">{data.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {getMetricLabel()}: {formatValue(data.value)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Prospects: {data.prospects}
                      </p>
                      <p className="text-sm text-gray-500">
                        Responses: {data.responses}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey="value"
              fill="#3B82F6"
              radius={[0, 4, 4, 0]}
              name={getMetricLabel()}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
