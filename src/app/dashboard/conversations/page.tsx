'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
        <p className="text-gray-500">
          View SMS conversation threads with prospects
        </p>
      </div>

      {/* Placeholder content */}
      <Card>
        <CardHeader>
          <CardTitle>SMS Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">Conversation viewer coming soon</p>
            <p className="text-sm">
              This page will display SMS threads with prospects, showing the full
              conversation history and qualification status.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
