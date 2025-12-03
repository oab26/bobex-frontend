'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Check, CheckCheck, Clock, User, Phone, Building2 } from 'lucide-react'
import { format } from 'date-fns'

interface Message {
  id: string
  message_direction: string
  message_content: string
  phone_from: string | null
  phone_to: string | null
  twilio_status: string | null
  sent_at: string | null
  delivered_at: string | null
  read_at: string | null
  created_at: string | null
}

interface Prospect {
  id: string
  firstname: string | null
  lastname: string | null
  company: string | null
  phone: string
  language: string | null
  qualification_status: string | null
}

interface ChatThreadProps {
  prospect: Prospect | null
  messages: Message[]
  isLoading?: boolean
}

const statusColors: Record<string, string> = {
  interested: 'bg-green-100 text-green-800',
  not_interested: 'bg-red-100 text-red-800',
  confused: 'bg-yellow-100 text-yellow-800',
  no_response: 'bg-gray-100 text-gray-800',
  invalid_number: 'bg-orange-100 text-orange-800',
}

const statusLabels: Record<string, string> = {
  interested: 'Interested',
  not_interested: 'Not Interested',
  confused: 'Confused',
  no_response: 'No Response',
  invalid_number: 'Invalid Number',
}

function DeliveryStatus({ status, deliveredAt, readAt }: { status: string | null; deliveredAt: string | null; readAt: string | null }) {
  if (readAt) {
    return <CheckCheck className="h-3 w-3 text-blue-500" />
  }
  if (deliveredAt || status === 'delivered') {
    return <CheckCheck className="h-3 w-3 text-gray-400" />
  }
  if (status === 'sent') {
    return <Check className="h-3 w-3 text-gray-400" />
  }
  return <Clock className="h-3 w-3 text-gray-300" />
}

export function ChatThread({ prospect, messages, isLoading }: ChatThreadProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/4" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <div className={`h-16 rounded-lg animate-pulse ${i % 2 === 0 ? 'bg-blue-100 w-2/3' : 'bg-gray-100 w-1/2'}`} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!prospect) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-lg font-medium">Select a conversation</p>
        <p className="text-sm">Choose a prospect from the list to view their messages</p>
      </div>
    )
  }

  const prospectName = [prospect.firstname, prospect.lastname].filter(Boolean).join(' ') || 'Unknown'

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{prospectName}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {prospect.company && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {prospect.company}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {prospect.phone}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {prospect.qualification_status && (
              <Badge className={statusColors[prospect.qualification_status] || 'bg-gray-100'}>
                {statusLabels[prospect.qualification_status] || prospect.qualification_status}
              </Badge>
            )}
            {prospect.language && (
              <Badge variant="outline">
                {prospect.language.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOutbound = message.message_direction === 'outbound'
            return (
              <div
                key={message.id}
                className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
              >
                <Card
                  className={`max-w-[75%] p-3 ${
                    isOutbound
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.message_content}
                  </p>
                  <div
                    className={`flex items-center gap-1 mt-1 text-xs ${
                      isOutbound ? 'text-blue-100 justify-end' : 'text-gray-400'
                    }`}
                  >
                    <span>
                      {message.sent_at
                        ? format(new Date(message.sent_at), 'MMM d, HH:mm')
                        : ''}
                    </span>
                    {isOutbound && (
                      <DeliveryStatus
                        status={message.twilio_status}
                        deliveredAt={message.delivered_at}
                        readAt={message.read_at}
                      />
                    )}
                  </div>
                </Card>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
