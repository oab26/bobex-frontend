import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const prospectId = searchParams.get('prospectId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const supabase = await createClient()

    if (prospectId) {
      // Get conversation thread for a specific prospect
      const { data: messages, error } = await supabase
        .from('sms_conversations')
        .select(`
          id,
          message_direction,
          message_content,
          phone_from,
          phone_to,
          twilio_status,
          sent_at,
          delivered_at,
          read_at,
          created_at
        `)
        .eq('prospect_id', prospectId)
        .order('sent_at', { ascending: true })

      if (error) {
        return NextResponse.json(
          { success: false, error: { code: 'QUERY_ERROR', message: error.message } },
          { status: 500 }
        )
      }

      // Get prospect info
      const { data: prospect } = await supabase
        .from('prospects')
        .select('id, firstname, lastname, company, phone, language, qualification_status')
        .eq('id', prospectId)
        .single()

      return NextResponse.json({
        success: true,
        data: {
          prospect,
          messages: messages || [],
        },
      })
    }

    // Get all conversation threads (grouped by prospect)
    // First get all prospects that have SMS conversations
    let prospectsQuery = supabase
      .from('prospects')
      .select(`
        id,
        firstname,
        lastname,
        company,
        phone,
        language,
        qualification_status,
        last_contact_date
      `)
      .order('last_contact_date', { ascending: false, nullsFirst: false })

    if (status && status !== 'all') {
      prospectsQuery = prospectsQuery.eq('qualification_status', status)
    }

    if (search) {
      prospectsQuery = prospectsQuery.or(`firstname.ilike.%${search}%,lastname.ilike.%${search}%,company.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    const { data: prospects, error: prospectsError } = await prospectsQuery

    if (prospectsError) {
      return NextResponse.json(
        { success: false, error: { code: 'QUERY_ERROR', message: prospectsError.message } },
        { status: 500 }
      )
    }

    // Get the latest message for each prospect
    const prospectIds = prospects?.map(p => p.id) || []

    if (prospectIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const { data: latestMessages, error: messagesError } = await supabase
      .from('sms_conversations')
      .select('prospect_id, message_content, message_direction, sent_at')
      .in('prospect_id', prospectIds)
      .order('sent_at', { ascending: false })

    if (messagesError) {
      return NextResponse.json(
        { success: false, error: { code: 'QUERY_ERROR', message: messagesError.message } },
        { status: 500 }
      )
    }

    // Group messages by prospect and get count + latest message
    const messagesByProspect = new Map<string, { lastMessage: string; lastMessageTime: string; direction: string; messageCount: number }>()

    for (const msg of latestMessages || []) {
      if (!messagesByProspect.has(msg.prospect_id)) {
        messagesByProspect.set(msg.prospect_id, {
          lastMessage: msg.message_content || '',
          lastMessageTime: msg.sent_at || '',
          direction: msg.message_direction || 'outbound',
          messageCount: 1,
        })
      } else {
        const existing = messagesByProspect.get(msg.prospect_id)!
        existing.messageCount++
      }
    }

    // Combine prospects with their latest messages
    const conversationThreads = prospects
      ?.filter(p => messagesByProspect.has(p.id))
      .map(prospect => ({
        id: prospect.id,
        prospect: {
          id: prospect.id,
          name: [prospect.firstname, prospect.lastname].filter(Boolean).join(' ') || 'Unknown',
          company: prospect.company,
          phone: prospect.phone,
          language: prospect.language,
          qualificationStatus: prospect.qualification_status,
        },
        lastMessage: messagesByProspect.get(prospect.id)?.lastMessage || '',
        lastMessageTime: messagesByProspect.get(prospect.id)?.lastMessageTime || '',
        lastMessageDirection: messagesByProspect.get(prospect.id)?.direction || 'outbound',
        messageCount: messagesByProspect.get(prospect.id)?.messageCount || 0,
      }))
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())

    return NextResponse.json({
      success: true,
      data: conversationThreads || [],
    })
  } catch (error) {
    console.error('Conversations API error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
