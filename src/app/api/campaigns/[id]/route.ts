import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('outreach_campaigns')
      .select('*')
      .eq('id', id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Campaign not found' } },
        { status: 404 }
      )
    }

    // Get analytics for this campaign
    const { data: analytics } = await supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', id)
      .order('metric_date', { ascending: false })
      .limit(30)

    // Get recent prospect activity
    const { data: recentActivity } = await supabase
      .from('contact_attempts')
      .select(`
        id,
        prospect_id,
        attempt_type,
        status,
        sent_at,
        prospects (
          id,
          firstname,
          lastname,
          company,
          phone,
          language
        )
      `)
      .eq('campaign_id', id)
      .order('sent_at', { ascending: false })
      .limit(50)

    return NextResponse.json({
      success: true,
      data: {
        campaign: {
          id: campaign.id,
          name: campaign.campaign_name,
          status: campaign.status,
          startDate: campaign.started_at,
          endDate: campaign.completed_at,
          totalProspects: campaign.total_prospects,
          contactedCount: campaign.contacted_count,
          responseCount: campaign.response_count,
          qualifiedCount: campaign.qualified_count,
          filtersApplied: campaign.filters_applied,
          settings: campaign.settings,
        },
        analytics,
        recentActivity: recentActivity?.map(a => ({
          id: a.id,
          prospectId: a.prospect_id,
          type: a.attempt_type,
          status: a.status,
          sentAt: a.sent_at,
          prospect: a.prospects,
        })),
      },
    })
  } catch (error) {
    console.error('Campaign detail API error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
