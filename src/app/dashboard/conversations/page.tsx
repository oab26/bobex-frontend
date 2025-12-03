'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { ConversationList } from '@/components/dashboard/ConversationList'
import { ChatThread } from '@/components/dashboard/ChatThread'
import useSWR from 'swr'

interface ConversationThread {
  id: string
  prospect: {
    id: string
    name: string
    company: string | null
    phone: string
    language: string | null
    qualificationStatus: string | null
  }
  lastMessage: string
  lastMessageTime: string
  lastMessageDirection: string
  messageCount: number
}

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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ConversationsPage() {
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Build URL for conversation list
  const listUrl = `/api/conversations?status=${statusFilter}${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}`

  // Fetch conversation list
  const { data: listData, isLoading: listLoading } = useSWR<{ success: boolean; data: ConversationThread[] }>(
    listUrl,
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30 seconds
  )

  // Fetch selected conversation thread
  const { data: threadData, isLoading: threadLoading } = useSWR<{ success: boolean; data: { prospect: Prospect; messages: Message[] } }>(
    selectedProspectId ? `/api/conversations?prospectId=${selectedProspectId}` : null,
    fetcher,
    { refreshInterval: 10000 } // Refresh every 10 seconds when viewing a thread
  )

  const conversations = listData?.success ? listData.data : []
  const selectedProspect = threadData?.success ? threadData.data.prospect : null
  const messages = threadData?.success ? threadData.data.messages : []

  // Auto-select first conversation on load
  useEffect(() => {
    if (!selectedProspectId && conversations.length > 0) {
      setSelectedProspectId(conversations[0].id)
    }
  }, [conversations, selectedProspectId])

  const handleSelectConversation = useCallback((id: string) => {
    setSelectedProspectId(id)
  }, [])

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
        <p className="text-gray-500">
          View SMS conversation threads with prospects
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-4 h-[calc(100%-4rem)]">
        {/* Conversation List - Left Panel */}
        <Card className="w-96 flex-shrink-0 overflow-hidden">
          <ConversationList
            conversations={conversations}
            selectedId={selectedProspectId}
            onSelect={handleSelectConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            isLoading={listLoading}
          />
        </Card>

        {/* Chat Thread - Right Panel */}
        <Card className="flex-1 overflow-hidden">
          <ChatThread
            prospect={selectedProspect}
            messages={messages}
            isLoading={threadLoading && !!selectedProspectId}
          />
        </Card>
      </div>
    </div>
  )
}
