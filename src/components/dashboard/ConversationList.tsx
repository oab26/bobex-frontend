'use client'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, Search, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

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

interface ConversationListProps {
  conversations: ConversationThread[]
  selectedId: string | null
  onSelect: (id: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
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
  invalid_number: 'Invalid',
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isLoading,
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter */}
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="not_interested">Not Interested</SelectItem>
            <SelectItem value="confused">Confused</SelectItem>
            <SelectItem value="no_response">No Response</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          <div className="divide-y">
            {conversations.map((thread) => (
              <button
                key={thread.id}
                onClick={() => onSelect(thread.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedId === thread.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {thread.prospect.name}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {thread.lastMessageTime
                          ? formatDistanceToNow(new Date(thread.lastMessageTime), { addSuffix: true })
                          : ''}
                      </span>
                    </div>
                    {thread.prospect.company && (
                      <p className="text-xs text-gray-500 truncate">{thread.prospect.company}</p>
                    )}
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {thread.lastMessageDirection === 'outbound' && (
                        <span className="text-gray-400">You: </span>
                      )}
                      {thread.lastMessage}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {thread.prospect.qualificationStatus && (
                        <Badge
                          variant="secondary"
                          className={statusColors[thread.prospect.qualificationStatus] || 'bg-gray-100'}
                        >
                          {statusLabels[thread.prospect.qualificationStatus] || thread.prospect.qualificationStatus}
                        </Badge>
                      )}
                      {thread.prospect.language && (
                        <Badge variant="outline" className="text-xs">
                          {thread.prospect.language.toUpperCase()}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400">
                        {thread.messageCount} message{thread.messageCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
