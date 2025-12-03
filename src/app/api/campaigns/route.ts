import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const status = searchParams.get('status')

    const supabase = await createClient()

    // Use campaign_summary view for better data
    let query = supabase
      .from('campaign_summary')
      .select('*', { count: 'exact' })
      .order('campaign_date', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data: campaigns, error, count } = await query

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'QUERY_ERROR', message: error.message } },
        { status: 500 }
      )
    }

    // Transform to expected format
    const formattedCampaigns = (campaigns || []).map(c => ({
      id: c.id,
      name: c.campaign_name,
      status: c.status,
      startDate: c.started_at,
      endDate: c.completed_at,
      totalProspects: c.total_prospects || 0,
      contactedCount: c.contacted_count || 0,
      responseCount: c.response_count || 0,
      qualifiedCount: c.qualified_count || 0,
      callbackCount: c.callback_count || 0,
      smsReplyCount: c.sms_reply_count || 0,
      responseRate: c.response_rate || 0,
      qualificationRate: c.qualification_rate || 0,
      durationMinutes: c.duration_minutes || 0,
    }))

    return NextResponse.json({
      success: true,
      data: formattedCampaigns,
      meta: {
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    })
  } catch (error) {
    console.error('Campaigns API error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
