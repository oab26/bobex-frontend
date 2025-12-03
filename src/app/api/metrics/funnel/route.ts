import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { FUNNEL_COLORS } from '@/lib/utils/constants'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const supabase = await createClient()

    // Stage 1: Contacted (unique prospects in contact_attempts)
    let contactedQuery = supabase
      .from('contact_attempts')
      .select('prospect_id', { count: 'exact', head: true })

    if (campaignId) contactedQuery = contactedQuery.eq('campaign_id', campaignId)
    if (startDate) contactedQuery = contactedQuery.gte('sent_at', startDate)
    if (endDate) contactedQuery = contactedQuery.lte('sent_at', endDate)

    // Get distinct count
    const { count: contactedCount, error: contactedError } = await contactedQuery

    // Stage 2: Callback/SMS (any response received)
    let responsesQuery = supabase
      .from('prospect_responses')
      .select('prospect_id', { count: 'exact', head: true })

    if (campaignId) responsesQuery = responsesQuery.eq('campaign_id', campaignId)
    if (startDate) responsesQuery = responsesQuery.gte('received_at', startDate)
    if (endDate) responsesQuery = responsesQuery.lte('received_at', endDate)

    const { count: responsesCount, error: responsesError } = await responsesQuery

    // Stage 3: Engaged (had SMS conversation)
    let engagedQuery = supabase
      .from('sms_conversations')
      .select('prospect_id', { count: 'exact', head: true })
      .eq('message_direction', 'inbound')

    if (campaignId) engagedQuery = engagedQuery.eq('campaign_id', campaignId)
    if (startDate) engagedQuery = engagedQuery.gte('sent_at', startDate)
    if (endDate) engagedQuery = engagedQuery.lte('sent_at', endDate)

    const { count: engagedCount, error: engagedError } = await engagedQuery

    // Stage 4: Qualified (interested)
    let qualifiedQuery = supabase
      .from('prospect_responses')
      .select('prospect_id', { count: 'exact', head: true })
      .eq('qualification_result', 'interested')

    if (campaignId) qualifiedQuery = qualifiedQuery.eq('campaign_id', campaignId)
    if (startDate) qualifiedQuery = qualifiedQuery.gte('received_at', startDate)
    if (endDate) qualifiedQuery = qualifiedQuery.lte('received_at', endDate)

    const { count: qualifiedCount, error: qualifiedError } = await qualifiedQuery

    // Stage 5: Vendor Notified
    let notifiedQuery = supabase
      .from('vendor_notifications')
      .select('prospect_id', { count: 'exact', head: true })

    if (campaignId) notifiedQuery = notifiedQuery.eq('campaign_id', campaignId)
    if (startDate) notifiedQuery = notifiedQuery.gte('sent_at', startDate)
    if (endDate) notifiedQuery = notifiedQuery.lte('sent_at', endDate)

    const { count: notifiedCount, error: notifiedError } = await notifiedQuery

    // Check for errors
    const errors = [contactedError, responsesError, engagedError, qualifiedError, notifiedError].filter(Boolean)
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: { code: 'QUERY_ERROR', message: errors[0]?.message } },
        { status: 500 }
      )
    }

    // Build funnel stages
    const contacted = contactedCount || 0
    const responded = responsesCount || 0
    const engaged = engagedCount || 0
    const qualified = qualifiedCount || 0
    const notified = notifiedCount || 0

    const stages = [
      {
        id: 'contacted',
        name: 'Contacted',
        count: contacted,
        percentage: 100,
        conversionRate: 100,
        color: FUNNEL_COLORS.contacted,
      },
      {
        id: 'callback_sms',
        name: 'Callback/SMS',
        count: responded,
        percentage: contacted > 0 ? (responded / contacted) * 100 : 0,
        conversionRate: contacted > 0 ? (responded / contacted) * 100 : 0,
        color: FUNNEL_COLORS.callback_sms,
      },
      {
        id: 'engaged',
        name: 'Engaged',
        count: engaged,
        percentage: contacted > 0 ? (engaged / contacted) * 100 : 0,
        conversionRate: responded > 0 ? (engaged / responded) * 100 : 0,
        color: FUNNEL_COLORS.responded,
      },
      {
        id: 'qualified',
        name: 'Qualified',
        count: qualified,
        percentage: contacted > 0 ? (qualified / contacted) * 100 : 0,
        conversionRate: engaged > 0 ? (qualified / engaged) * 100 : 0,
        color: FUNNEL_COLORS.qualified,
      },
      {
        id: 'notified',
        name: 'Vendor Notified',
        count: notified,
        percentage: contacted > 0 ? (notified / contacted) * 100 : 0,
        conversionRate: qualified > 0 ? (notified / qualified) * 100 : 0,
        color: FUNNEL_COLORS.notified,
      },
    ]

    // Format percentages
    const formattedStages = stages.map(stage => ({
      ...stage,
      percentage: Number(stage.percentage.toFixed(1)),
      conversionRate: Number(stage.conversionRate.toFixed(1)),
    }))

    const overallConversionRate = contacted > 0 ? (notified / contacted) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        stages: formattedStages,
        overallConversionRate: Number(overallConversionRate.toFixed(1)),
      },
    })
  } catch (error) {
    console.error('Funnel API error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
