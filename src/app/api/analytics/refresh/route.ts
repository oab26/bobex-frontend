import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      return NextResponse.json({
        success: true,
        data: {
          message: 'N8N webhook not configured. Analytics not refreshed.',
        },
      })
    }

    // Trigger N8N analytics workflow
    const response = await fetch(`${n8nWebhookUrl}/webhook/trigger-analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        triggeredAt: new Date().toISOString(),
        source: 'dashboard',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('N8N analytics webhook failed:', errorText)
      return NextResponse.json(
        { success: false, error: { code: 'WEBHOOK_ERROR', message: 'Failed to trigger analytics refresh' } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Analytics refresh triggered successfully',
        triggeredAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Analytics refresh error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
