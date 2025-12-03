import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const supabase = await createClient()

    // Get daily KPI summary from view
    let query = supabase
      .from('daily_kpi_summary')
      .select('*')
      .order('metric_date', { ascending: false })

    if (startDate) {
      query = query.gte('metric_date', startDate)
    }
    if (endDate) {
      query = query.lte('metric_date', endDate)
    }

    const { data: kpiData, error: kpiError } = await query.limit(30)

    if (kpiError) {
      return NextResponse.json(
        { success: false, error: { code: 'QUERY_ERROR', message: kpiError.message } },
        { status: 500 }
      )
    }

    // Also get campaign-specific data if campaignId provided
    let campaignData = null
    if (campaignId) {
      const { data: campaign } = await supabase
        .from('campaign_analytics')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('metric_date', { ascending: false })
        .limit(1)
        .single()

      campaignData = campaign
    }

    // Aggregate the KPI data
    const aggregated = kpiData?.reduce(
      (acc, row) => ({
        totalContacted: acc.totalContacted + (row.total_contacted || 0),
        totalCallbacks: acc.totalCallbacks + (row.total_callbacks || 0),
        totalSmsResponses: acc.totalSmsResponses + (row.total_sms_responses || 0),
        totalReconnected: acc.totalReconnected + (row.total_reconnected || 0),
        totalInterested: acc.totalInterested + (row.total_interested || 0),
        totalNotInterested: acc.totalNotInterested + (row.total_not_interested || 0),
      }),
      {
        totalContacted: 0,
        totalCallbacks: 0,
        totalSmsResponses: 0,
        totalReconnected: 0,
        totalInterested: 0,
        totalNotInterested: 0,
      }
    ) || {
      totalContacted: 0,
      totalCallbacks: 0,
      totalSmsResponses: 0,
      totalReconnected: 0,
      totalInterested: 0,
      totalNotInterested: 0,
    }

    // Calculate reconnection rate
    const reconnectionRate = aggregated.totalContacted > 0
      ? (aggregated.totalReconnected / aggregated.totalContacted) * 100
      : 0

    // Calculate trends (compare last 7 days to previous 7 days)
    const recentData = kpiData?.slice(0, 7) || []
    const previousData = kpiData?.slice(7, 14) || []

    const recentTotal = recentData.reduce((acc, row) => acc + (row.total_contacted || 0), 0)
    const previousTotal = previousData.reduce((acc, row) => acc + (row.total_contacted || 0), 0)

    const contactedChange = previousTotal > 0
      ? ((recentTotal - previousTotal) / previousTotal) * 100
      : 0

    return NextResponse.json({
      success: true,
      data: {
        ...aggregated,
        reconnectionRate: Number(reconnectionRate.toFixed(2)),
        trends: {
          contactedChange: Number(contactedChange.toFixed(1)),
          callbacksChange: 0, // TODO: Calculate
          smsResponsesChange: 0, // TODO: Calculate
          reconnectedChange: 0, // TODO: Calculate
          rateChange: 0, // TODO: Calculate
        },
        campaignData,
        rawData: kpiData,
      },
      meta: {
        periodStart: startDate || kpiData?.[kpiData.length - 1]?.metric_date,
        periodEnd: endDate || kpiData?.[0]?.metric_date,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Metrics API error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
