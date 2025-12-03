'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Users,
  Send,
  MessageSquare,
  TrendingUp,
  Phone,
  Settings,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface CampaignDetail {
  id: string
  name: string
  status: string
  startDate: string | null
  endDate: string | null
  totalProspects: number
  contactedCount: number
  responseCount: number
  qualifiedCount: number
  filtersApplied: Record<string, unknown> | null
  settings: Record<string, unknown> | null
}

interface Activity {
  id: string
  prospectId: string
  type: string
  status: string
  sentAt: string | null
  message: string | null
  direction: 'inbound' | 'outbound'
  prospect: {
    id: string
    firstname: string | null
    lastname: string | null
    company: string | null
    phone: string
    language: string | null
  } | null
}

interface ApiResponse {
  success: boolean
  data: {
    campaign: CampaignDetail
    analytics: unknown[]
    recentActivity: Activity[]
  }
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  paused: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  paused: 'Paused',
  failed: 'Failed',
}

const activityStatusColors: Record<string, string> = {
  delivered: 'text-green-600',
  sent: 'text-blue-600',
  failed: 'text-red-600',
  queued: 'text-yellow-600',
  pending: 'text-gray-600',
  received: 'text-green-600',
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-48" />
      <Skeleton className="h-96" />
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Not Found</h2>
      <p className="text-gray-500 mb-4">The campaign you're looking for doesn't exist.</p>
      <Link href="/dashboard/campaigns">
        <Button variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
      </Link>
    </div>
  )
}

function truncateMessage(message: string | null, maxLength: number = 50): string {
  if (!message) return '-'
  if (message.length <= maxLength) return message
  return message.substring(0, maxLength) + '...'
}

export default function CampaignDetailPage() {
  const params = useParams()
  const campaignId = params.id as string

  const { data, isLoading, error } = useSWR<ApiResponse>(
    campaignId ? `/api/campaigns/${campaignId}` : null,
    fetcher,
    { refreshInterval: 30000 }
  )

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error || !data?.success || !data?.data?.campaign) {
    return <NotFoundState />
  }

  const { campaign, recentActivity } = data.data

  const responseRate = campaign.contactedCount > 0
    ? (campaign.responseCount / campaign.contactedCount) * 100
    : 0

  const getProspectName = (prospect: Activity['prospect']) => {
    if (!prospect) return 'Unknown'
    const name = [prospect.firstname, prospect.lastname].filter(Boolean).join(' ')
    return name || 'Unknown'
  }

  const getActivityIcon = (activity: Activity) => {
    if (activity.type === 'missed_call' || activity.type === 'call') {
      return <Phone className="h-4 w-4 text-orange-500" />
    }
    // SMS - show direction with colors
    if (activity.direction === 'inbound') {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />
    }
    return <ArrowUpRight className="h-4 w-4 text-blue-500" />
  }

  const getActivityLabel = (activity: Activity) => {
    if (activity.type === 'missed_call') return 'Missed Call'
    if (activity.type === 'call') return 'Call'
    return activity.direction === 'inbound' ? 'SMS In' : 'SMS Out'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/dashboard/campaigns">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
            <Badge className={statusColors[campaign.status] || 'bg-gray-100'}>
              {statusLabels[campaign.status] || campaign.status}
            </Badge>
          </div>
          <p className="text-gray-500">
            {campaign.startDate && (
              <>
                Started {format(new Date(campaign.startDate), 'MMM d, yyyy HH:mm')}
                {campaign.endDate && (
                  <> - Ended {format(new Date(campaign.endDate), 'MMM d, yyyy HH:mm')}</>
                )}
              </>
            )}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Prospects</p>
                <p className="text-2xl font-bold">{campaign.totalProspects.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Contacted</p>
                <p className="text-2xl font-bold">{campaign.contactedCount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Responses</p>
                <p className="text-2xl font-bold">{campaign.responseCount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Response Rate</p>
                <p className="text-2xl font-bold">{responseRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Campaign Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Qualified Leads</p>
              <p className="font-medium">{campaign.qualifiedCount} prospects</p>
            </div>
            {campaign.filtersApplied && (
              <div>
                <p className="text-sm text-gray-500">Filters Applied</p>
                <p className="font-medium">
                  {Object.keys(campaign.filtersApplied).length > 0
                    ? Object.entries(campaign.filtersApplied)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')
                    : 'None'}
                </p>
              </div>
            )}
            {campaign.settings && (
              <div>
                <p className="text-sm text-gray-500">Batch Size</p>
                <p className="font-medium">
                  {(campaign.settings as { batchSize?: number })?.batchSize || 'Default'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity && recentActivity.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prospect</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="min-w-[200px]">Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{getProspectName(activity.prospect)}</p>
                        {activity.prospect?.company && (
                          <p className="text-sm text-gray-500">{activity.prospect.company}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActivityIcon(activity)}
                        <span>{getActivityLabel(activity)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <span className="text-gray-600 text-sm">
                        {truncateMessage(activity.message)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={activityStatusColors[activity.status] || 'text-gray-600'}>
                        {activity.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-gray-500">
                      {activity.sentAt
                        ? formatDistanceToNow(new Date(activity.sentAt), { addSuffix: true })
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No activity recorded yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
