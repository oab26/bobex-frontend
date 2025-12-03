'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FunnelStage } from '@/types/dashboard'
import { formatNumber, formatPercent } from '@/lib/utils/formatters'

interface FunnelChartProps {
  stages: FunnelStage[]
  loading?: boolean
  title?: string
  onStageClick?: (stage: FunnelStage) => void
}

export function FunnelChart({
  stages,
  loading = false,
  title = 'Prospect Journey',
  onStageClick,
}: FunnelChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    )
  }

  const maxValue = stages[0]?.count || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const widthPercent = (stage.count / maxValue) * 100
            const minWidth = 20 // Minimum 20% width for visibility
            const displayWidth = Math.max(widthPercent, minWidth)

            return (
              <div key={stage.id} className="relative">
                {/* Conversion rate from previous */}
                {index > 0 && (
                  <div className="absolute -top-2 right-0 text-xs text-gray-500">
                    {stage.conversionRate.toFixed(1)}% from previous
                  </div>
                )}

                {/* Stage bar */}
                <div
                  className="relative h-14 rounded-lg cursor-pointer transition-all hover:opacity-90 mx-auto flex items-center justify-center"
                  style={{
                    width: `${displayWidth}%`,
                    backgroundColor: stage.color,
                  }}
                  onClick={() => onStageClick?.(stage)}
                >
                  <div className="flex items-center text-white text-sm font-medium px-4">
                    <span>{stage.name}</span>
                    <span className="mx-2">|</span>
                    <span>{formatNumber(stage.count)}</span>
                  </div>
                </div>

                {/* Percentage of total */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-16 text-sm text-gray-600 font-medium">
                  {formatPercent(stage.percentage)}
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary stats */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between text-sm">
          <span className="text-gray-500">
            Overall Conversion:
            <span className="font-semibold text-green-600 ml-1">
              {formatPercent(
                stages.length > 0
                  ? (stages[stages.length - 1].count / stages[0].count) * 100
                  : 0
              )}
            </span>
          </span>
          <span className="text-gray-500">
            Drop-off:
            <span className="font-semibold text-red-600 ml-1">
              {formatPercent(
                stages.length > 0
                  ? 100 - (stages[stages.length - 1].count / stages[0].count) * 100
                  : 0
              )}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
