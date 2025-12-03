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

    // Get contact attempts (missed calls)
    const { data: contactAttempts } = await supabase
      .from('contact_attempts')
      .select(`
        id,
        prospect_id,
        attempt_type,
        status,
        sent_at,
        message_content,
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

    // Get unique prospect IDs from this campaign
    const prospectIds = [...new Set(contactAttempts?.map(a => a.prospect_id) || [])]

    // Get SMS conversations for these prospects
    const { data: smsConversations } = prospectIds.length > 0
      ? await supabase
          .from('sms_conversations')
          .select(`
            id,
            prospect_id,
            message_direction,
            message_content,
            sent_at,
            twilio_status,
            prospects (
              id,
              firstname,
              lastname,
              company,
              phone,
              language
            )
          `)
          .in('prospect_id', prospectIds)
          .order('sent_at', { ascending: false })
          .limit(50)
      : { data: [] }

    // Calculate qualified count from prospects table (not campaign table)
    const { count: qualifiedCount } = prospectIds.length > 0
      ? await supabase
          .from('prospects')
          .select('id', { count: 'exact', head: true })
          .in('id', prospectIds)
          .eq('qualification_status', 'interested')
      : { count: 0 }

    // Merge contact attempts and SMS into unified activity list
    const callActivity = (contactAttempts || []).map(a => ({
      id: a.id,
      prospectId: a.prospect_id,
      type: a.attempt_type || 'call',
      status: a.status,
      sentAt: a.sent_at,
      message: a.message_content,
      direction: 'outbound' as const,
      prospect: a.prospects,
    }))

    const smsActivity = (smsConversations || []).map(s => ({
      id: s.id,
      prospectId: s.prospect_id,
      type: 'sms',
      status: s.twilio_status || 'sent',
      sentAt: s.sent_at,
      message: s.message_content,
      direction: s.message_direction as 'inbound' | 'outbound',
      prospect: s.prospects,
    }))

    // Combine and sort by time (newest first)
    const allActivity = [...callActivity, ...smsActivity]
      .sort((a, b) => {
        const timeA = a.sentAt ? new Date(a.sentAt).getTime() : 0
        const timeB = b.sentAt ? new Date(b.sentAt).getTime() : 0
        return timeB - timeA
      })
      .slice(0, 50)

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
          qualifiedCount: qualifiedCount || 0, // Calculated from prospects table
          filtersApplied: campaign.filters_applied,
          settings: campaign.settings,
        },
        analytics,
        recentActivity: allActivity,
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
