'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { HeatmapCell } from '@/types/dashboard'
import { DAY_LABELS, getHeatmapColor, HEATMAP_COLORS } from '@/lib/utils/constants'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface HeatmapChartProps {
  data: HeatmapCell[]
  loading?: boolean
  title?: string
  onCellClick?: (cell: HeatmapCell) => void
}

export function HeatmapChart({
  data,
  loading = false,
  title = 'Optimal Contact Times',
  onCellClick,
}: HeatmapChartProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-56 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Hours to display (show every 3 hours in header)
  const displayHours = [0, 3, 6, 9, 12, 15, 18, 21]

  // Get cell by day and hour
  const getCell = (day: number, hour: number): HeatmapCell | undefined => {
    return data.find(c => c.day === day && c.hour === hour)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Tooltip */}
        {hoveredCell && (
          <div className="absolute z-10 bg-white p-3 rounded-lg shadow-lg border text-sm">
            <p className="font-medium">{hoveredCell.label}</p>
            <p className="text-gray-600">
              Response Rate: {hoveredCell.value.toFixed(1)}%
            </p>
            <p className="text-gray-500">Contacts: {hoveredCell.contacts}</p>
            <p className="text-gray-500">Responses: {hoveredCell.responses}</p>
          </div>
        )}

        {/* Hour labels */}
        <div className="flex ml-12 mb-2">
          {displayHours.map(hour => (
            <div
              key={hour}
              className="text-xs text-gray-500 flex-1 text-center"
            >
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="space-y-1">
          {DAY_LABELS.map((day, dayIndex) => (
            <div key={day} className="flex items-center">
              <span className="w-10 text-xs text-gray-500 font-medium">
                {day}
              </span>
              <div className="flex gap-0.5 flex-1">
                {Array.from({ length: 24 }, (_, hour) => {
                  const cell = getCell(dayIndex, hour)
                  const value = cell?.value || 0

                  return (
                    <div
                      key={hour}
                      className={cn(
                        'flex-1 h-6 rounded-sm cursor-pointer transition-all',
                        'hover:ring-2 hover:ring-blue-400 hover:z-10'
                      )}
                      style={{ backgroundColor: getHeatmapColor(value) }}
                      onMouseEnter={() => cell && setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      onClick={() => cell && onCellClick?.(cell)}
                      title={cell ? `${cell.label}: ${value}%` : 'No data'}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center mt-4 gap-4 text-xs text-gray-500">
          <span>Lower</span>
          <div className="flex gap-1">
            {Object.values(HEATMAP_COLORS).map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span>Higher Response Rate</span>
        </div>
      </CardContent>
    </Card>
  )
}
