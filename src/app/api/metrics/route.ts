import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')

    const supabase = await createClient()

    // Get unique prospects contacted (for metrics)
    const { data: uniqueProspectsData, error: contactedError } = await supabase
      .from('contact_attempts')
      .select('prospect_id')

    if (contactedError) {
      console.error('Error fetching contacted prospects:', contactedError)
    }

    const uniqueContactedCount = new Set(uniqueProspectsData?.map(p => p.prospect_id) || []).size

    // Get SMS responses = inbound messages in sms_conversations
    const { count: totalSmsResponses, error: smsError } = await supabase
      .from('sms_conversations')
      .select('id', { count: 'exact', head: true })
      .eq('message_direction', 'inbound')

    if (smsError) {
      console.error('Error fetching SMS responses:', smsError)
    }

    // Get unique prospects who responded (for response rate calculation)
    const { data: respondersData, error: respondersError } = await supabase
      .from('sms_conversations')
      .select('prospect_id')
      .eq('message_direction', 'inbound')

    if (respondersError) {
      console.error('Error fetching responders:', respondersError)
    }

    const uniqueRespondersCount = new Set(respondersData?.map(r => r.prospect_id) || []).size

    // Get reconnected = prospects that responded (interested or not_interested)
    const { count: totalReconnected, error: reconnectedError } = await supabase
      .from('prospects')
      .select('id', { count: 'exact', head: true })
      .in('qualification_status', ['interested', 'not_interested'])

    if (reconnectedError) {
      console.error('Error fetching reconnected count:', reconnectedError)
    }

    // Get interested count
    const { count: totalInterested, error: interestedError } = await supabase
      .from('prospects')
      .select('id', { count: 'exact', head: true })
      .eq('qualification_status', 'interested')

    if (interestedError) {
      console.error('Error fetching interested count:', interestedError)
    }

    // Get not interested count
    const { count: totalNotInterested, error: notInterestedError } = await supabase
      .from('prospects')
      .select('id', { count: 'exact', head: true })
      .eq('qualification_status', 'not_interested')

    if (notInterestedError) {
      console.error('Error fetching not interested count:', notInterestedError)
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

    // Calculate response rate (unique responders / contacted)
    const responseRate = uniqueContactedCount > 0
      ? (uniqueRespondersCount / uniqueContactedCount) * 100
      : 0

    // Calculate reconnection rate
    const reconnectionRate = uniqueContactedCount > 0
      ? ((totalReconnected || 0) / uniqueContactedCount) * 100
      : 0

    return NextResponse.json({
      success: true,
      data: {
        totalContacted: uniqueContactedCount,
        totalSmsResponses: totalSmsResponses || 0,
        totalReconnected: totalReconnected || 0,
        totalInterested: totalInterested || 0,
        totalNotInterested: totalNotInterested || 0,
        responseRate: Number(responseRate.toFixed(2)),
        reconnectionRate: Number(reconnectionRate.toFixed(2)),
        trends: {
          contactedChange: 0,
          smsResponsesChange: 0,
          reconnectedChange: 0,
          rateChange: 0,
        },
        campaignData,
      },
      meta: {
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
