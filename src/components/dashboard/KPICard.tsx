'use client'

import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatNumber, formatPercent } from '@/lib/utils/formatters'

interface KPICardProps {
  title: string
  value: number
  unit?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    period?: string
  }
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'amber' | 'purple'
  loading?: boolean
  isPercentage?: boolean
}

const colorClasses = {
  blue: {
    icon: 'bg-blue-50 text-blue-600',
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-gray-500',
    },
  },
  green: {
    icon: 'bg-green-50 text-green-600',
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-gray-500',
    },
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600',
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-gray-500',
    },
  },
  purple: {
    icon: 'bg-purple-50 text-purple-600',
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-gray-500',
    },
  },
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  icon,
  color = 'blue',
  loading = false,
  isPercentage = false,
}: KPICardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    )
  }

  const colors = colorClasses[color]
  const displayValue = isPercentage ? formatPercent(value) : formatNumber(value)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">{title}</span>
          {icon && (
            <div className={cn('p-2 rounded-lg', colors.icon)}>
              {icon}
            </div>
          )}
        </div>

        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {displayValue}
          </span>
          {unit && !isPercentage && (
            <span className="text-sm text-gray-500 ml-1">{unit}</span>
          )}
        </div>

        {trend && (
          <div className={cn('flex items-center text-sm', colors.trend[trend.direction])}>
            {trend.direction === 'up' && <ArrowUpIcon className="w-4 h-4 mr-1" />}
            {trend.direction === 'down' && <ArrowDownIcon className="w-4 h-4 mr-1" />}
            {trend.direction === 'neutral' && <MinusIcon className="w-4 h-4 mr-1" />}
            <span>
              {trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)}%
            </span>
            {trend.period && (
              <span className="text-gray-400 ml-1">{trend.period}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
