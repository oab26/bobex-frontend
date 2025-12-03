import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// This endpoint receives updates from N8N workflows
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    const supabase = await createClient()

    switch (type) {
      case 'campaign_update':
        // Update campaign status/metrics
        if (data.campaignId) {
          await supabase
            .from('outreach_campaigns')
            .update({
              status: data.status,
              contacted_count: data.contactedCount,
              response_count: data.responseCount,
              completed_at: data.status === 'completed' ? new Date().toISOString() : null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', data.campaignId)
        }
        break

      case 'analytics_update':
        // Trigger refresh of analytics cache
        // This is handled by the analytics workflow itself
        break

      case 'prospect_update':
        // Update prospect qualification status
        if (data.prospectId) {
          await supabase
            .from('prospects')
            .update({
              qualification_status: data.qualificationStatus,
              last_response_date: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', data.prospectId)
        }
        break

      case 'notification_sent':
        // Log that a vendor notification was sent
        // This is already handled by the N8N workflow
        break

      default:
        console.log('Unknown webhook type:', type)
    }

    return NextResponse.json({
      success: true,
      data: {
        received: true,
        type,
        processedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('N8N webhook error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Webhook processing failed' } },
      { status: 500 }
    )
  }
}
