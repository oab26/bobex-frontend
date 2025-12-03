import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { format, subDays, eachDayOfInterval } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const interval = searchParams.get('interval') || 'daily'
    const days = interval === 'weekly' ? 28 : 7

    const supabase = await createClient()

    // Get date range
    const endDate = new Date()
    const startDate = subDays(endDate, days)

    // Generate all dates in range
    const allDates = eachDayOfInterval({ start: startDate, end: endDate })
      .map(date => format(date, 'yyyy-MM-dd'))

    // Get contact attempts grouped by date
    const { data: contactsData } = await supabase
      .from('contact_attempts')
      .select('prospect_id, sent_at')
      .gte('sent_at', startDate.toISOString())
      .lte('sent_at', endDate.toISOString())

    // Get SMS responses (inbound) grouped by date
    const { data: smsData } = await supabase
      .from('sms_conversations')
      .select('id, sent_at')
      .eq('message_direction', 'inbound')
      .gte('sent_at', startDate.toISOString())
      .lte('sent_at', endDate.toISOString())

    // Get prospects qualification status changes
    const { data: prospectsData } = await supabase
      .from('prospects')
      .select('id, qualification_status, updated_at')
      .in('qualification_status', ['interested', 'not_interested'])

    // Aggregate data by date
    const contactsByDate: Record<string, Set<string>> = {}
    const smsByDate: Record<string, number> = {}
    const reconnectedByDate: Record<string, number> = {}

    // Initialize all dates
    allDates.forEach(date => {
      contactsByDate[date] = new Set()
      smsByDate[date] = 0
      reconnectedByDate[date] = 0
    })

    // Count contacts by date (unique prospects)
    contactsData?.forEach(contact => {
      if (contact.sent_at) {
        const date = format(new Date(contact.sent_at), 'yyyy-MM-dd')
        if (contactsByDate[date]) {
          contactsByDate[date].add(contact.prospect_id)
        }
      }
    })

    // Count SMS responses by date
    smsData?.forEach(sms => {
      if (sms.sent_at) {
        const date = format(new Date(sms.sent_at), 'yyyy-MM-dd')
        if (smsByDate[date] !== undefined) {
          smsByDate[date]++
        }
      }
    })

    // Count reconnected by date (when status changed)
    prospectsData?.forEach(prospect => {
      if (prospect.updated_at) {
        const date = format(new Date(prospect.updated_at), 'yyyy-MM-dd')
        if (reconnectedByDate[date] !== undefined) {
          reconnectedByDate[date]++
        }
      }
    })

    // Build trend data
    const trendData = allDates.map(date => {
      const contacts = contactsByDate[date]?.size || 0
      const smsResponses = smsByDate[date] || 0
      const reconnected = reconnectedByDate[date] || 0
      const reconnectionRate = contacts > 0
        ? Number(((reconnected / contacts) * 100).toFixed(1))
        : 0

      return {
        date,
        contacts,
        smsResponses,
        reconnected,
        reconnectionRate,
      }
    })

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
            smsResponses: 0,
            reconnected: 0,
            reconnectionRate: 0,
          }
        }

        weeklyMap[weekKey].contacts += day.contacts
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
        id: 'smsResponses',
        label: 'SMS Responses',
        data: aggregatedData.map(d => d.smsResponses),
        color: '#F59E0B',
      },
      {
        id: 'reconnected',
        label: 'Reconnected',
        data: aggregatedData.map(d => d.reconnected),
        color: '#10B981',
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
