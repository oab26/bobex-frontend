import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignName, batchSize, maxProspects, filters } = body

    // Validate required fields
    if (!campaignName) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Campaign name is required' } },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Create a new campaign record
    const { data: campaign, error: campaignError } = await supabase
      .from('outreach_campaigns')
      .insert({
        campaign_name: campaignName,
        status: 'pending',
        campaign_date: new Date().toISOString().split('T')[0],
        total_prospects: maxProspects || 0,
        filters_applied: filters || {},
        settings: {
          batchSize: batchSize || 50,
          maxProspects: maxProspects,
        },
      })
      .select()
      .single()

    if (campaignError) {
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: campaignError.message } },
        { status: 500 }
      )
    }

    // Trigger N8N workflow if webhook URL is configured
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (n8nWebhookUrl) {
      try {
        const webhookResponse = await fetch(`${n8nWebhookUrl}/webhook/start-campaign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            campaignId: campaign.id,
            campaignName,
            batchSize: batchSize || 50,
            maxProspects,
            filters,
          }),
        })

        if (!webhookResponse.ok) {
          console.error('N8N webhook failed:', await webhookResponse.text())
          // Update campaign status to failed
          await supabase
            .from('outreach_campaigns')
            .update({ status: 'failed' })
            .eq('id', campaign.id)

          return NextResponse.json(
            { success: false, error: { code: 'WEBHOOK_ERROR', message: 'Failed to trigger N8N workflow' } },
            { status: 500 }
          )
        }

        // Update campaign status to in_progress
        await supabase
          .from('outreach_campaigns')
          .update({
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .eq('id', campaign.id)

      } catch (webhookError) {
        console.error('N8N webhook error:', webhookError)
        // Campaign created but workflow not triggered
        return NextResponse.json({
          success: true,
          data: {
            campaignId: campaign.id,
            status: 'pending',
            message: 'Campaign created but workflow trigger failed. Will retry.',
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        campaignId: campaign.id,
        status: n8nWebhookUrl ? 'in_progress' : 'pending',
        message: n8nWebhookUrl
          ? 'Campaign started successfully'
          : 'Campaign created. N8N webhook not configured.',
      },
    })
  } catch (error) {
    console.error('Campaign trigger error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
