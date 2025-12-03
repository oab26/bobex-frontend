import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get('endDate') || new Date().toISOString()
    const interval = searchParams.get('interval') || 'daily' // daily, weekly

    const supabase = await createClient()

    // Get data from daily_kpi_summary view
    let query = supabase
      .from('daily_kpi_summary')
      .select('*')
      .gte('metric_date', startDate.split('T')[0])
      .lte('metric_date', endDate.split('T')[0])
      .order('metric_date', { ascending: true })

    const { data: kpiData, error } = await query

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'QUERY_ERROR', message: error.message } },
        { status: 500 }
      )
    }

    // Transform data for chart
    const trendData = (kpiData || []).map(row => ({
      date: row.metric_date,
      contacts: row.total_contacted || 0,
      callbacks: row.total_callbacks || 0,
      smsResponses: row.total_sms_responses || 0,
      reconnected: row.total_reconnected || 0,
      reconnectionRate: row.avg_reconnection_rate || 0,
    }))

    // If weekly interval, aggregate by week
    let aggregatedData = trendData

    if (interval === 'weekly' && trendData.length > 0) {
      const weeklyMap: Record<string, typeof trendData[0]> = {}

      trendData.forEach(day => {
        if (!day.date) return
        const date = new Date(day.date)
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay() + 1) // Monday
        const weekKey = format(weekStart, 'yyyy-MM-dd')

        if (!weeklyMap[weekKey]) {
          weeklyMap[weekKey] = {
            date: weekKey,
            contacts: 0,
            callbacks: 0,
            smsResponses: 0,
            reconnected: 0,
            reconnectionRate: 0,
          }
        }

        weeklyMap[weekKey].contacts += day.contacts
        weeklyMap[weekKey].callbacks += day.callbacks
        weeklyMap[weekKey].smsResponses += day.smsResponses
        weeklyMap[weekKey].reconnected += day.reconnected
      })

      // Calculate weekly reconnection rates
      aggregatedData = Object.values(weeklyMap).map(week => ({
        ...week,
        reconnectionRate: week.contacts > 0
          ? Number(((week.reconnected / week.contacts) * 100).toFixed(1))
          : 0,
      }))
    }

    // Format labels
    const labels = aggregatedData
      .filter(d => d.date)
      .map(d =>
        format(new Date(d.date!), interval === 'weekly' ? 'MMM d' : 'MMM d')
      )

    const datasets = [
      {
        id: 'contacts',
        label: 'Contacts',
        data: aggregatedData.map(d => d.contacts),
        color: '#3B82F6',
      },
      {
        id: 'callbacks',
        label: 'Callbacks',
        data: aggregatedData.map(d => d.callbacks),
        color: '#10B981',
      },
      {
        id: 'smsResponses',
        label: 'SMS Responses',
        data: aggregatedData.map(d => d.smsResponses),
        color: '#F59E0B',
      },
      {
        id: 'reconnected',
        label: 'Reconnected',
        data: aggregatedData.map(d => d.reconnected),
        color: '#8B5CF6',
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        labels,
        datasets,
        rawData: aggregatedData,
      },
    })
  } catch (error) {
    console.error('Trends API error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
