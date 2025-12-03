import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DAY_LABELS_FULL } from '@/lib/utils/constants'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get('endDate') || new Date().toISOString()

    const supabase = await createClient()

    // Query contact attempts grouped by day and hour
    let query = supabase
      .from('contact_attempts')
      .select(`
        id,
        sent_at,
        prospect_id
      `)
      .gte('sent_at', startDate)
      .lte('sent_at', endDate)

    if (campaignId) {
      query = query.eq('campaign_id', campaignId)
    }

    const { data: attempts, error: attemptsError } = await query

    if (attemptsError) {
      return NextResponse.json(
        { success: false, error: { code: 'QUERY_ERROR', message: attemptsError.message } },
        { status: 500 }
      )
    }

    // Query responses
    let responsesQuery = supabase
      .from('prospect_responses')
      .select(`
        id,
        prospect_id,
        received_at
      `)
      .gte('received_at', startDate)
      .lte('received_at', endDate)

    if (campaignId) {
      responsesQuery = responsesQuery.eq('campaign_id', campaignId)
    }

    const { data: responses, error: responsesError } = await responsesQuery

    if (responsesError) {
      return NextResponse.json(
        { success: false, error: { code: 'QUERY_ERROR', message: responsesError.message } },
        { status: 500 }
      )
    }

    // Create a map of prospect IDs that responded
    const respondedProspects = new Set(responses?.map(r => r.prospect_id) || [])

    // Build heatmap grid (7 days x 24 hours)
    const grid: Array<{
      day: number
      hour: number
      value: number
      contacts: number
      responses: number
      label: string
    }> = []

    // Initialize counts
    const counts: Record<string, { contacts: Set<string>; responses: Set<string> }> = {}

    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `${day}-${hour}`
        counts[key] = { contacts: new Set(), responses: new Set() }
      }
    }

    // Process attempts
    attempts?.forEach(attempt => {
      if (!attempt.sent_at) return
      const date = new Date(attempt.sent_at)
      // Convert to day of week (0 = Monday in our system)
      const day = (date.getDay() + 6) % 7 // Shift Sunday (0) to 6, Mon (1) to 0, etc.
      const hour = date.getHours()
      const key = `${day}-${hour}`

      if (counts[key]) {
        counts[key].contacts.add(attempt.prospect_id)
        if (respondedProspects.has(attempt.prospect_id)) {
          counts[key].responses.add(attempt.prospect_id)
        }
      }
    })

    // Build grid with calculated values
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `${day}-${hour}`
        const contactCount = counts[key].contacts.size
        const responseCount = counts[key].responses.size
        const value = contactCount > 0 ? (responseCount / contactCount) * 100 : 0

        grid.push({
          day,
          hour,
          value: Number(value.toFixed(1)),
          contacts: contactCount,
          responses: responseCount,
          label: `${DAY_LABELS_FULL[day]} ${hour.toString().padStart(2, '0')}:00`,
        })
      }
    }

    // Calculate stats
    const values = grid.map(g => g.value).filter(v => v > 0)
    const maxValue = values.length > 0 ? Math.max(...values) : 0
    const minValue = values.length > 0 ? Math.min(...values) : 0
    const averageValue = values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0

    return NextResponse.json({
      success: true,
      data: {
        grid,
        maxValue,
        minValue,
        averageValue: Number(averageValue.toFixed(1)),
      },
    })
  } catch (error) {
    console.error('Heatmap API error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
