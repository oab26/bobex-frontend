'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Campaign } from '@/types/dashboard'
import { formatDate, formatStatus, getStatusColor, formatPercent } from '@/lib/utils/formatters'
import { ChevronRight } from 'lucide-react'

interface CampaignTableProps {
  campaigns: Campaign[]
  loading?: boolean
  title?: string
}

export function CampaignTable({
  campaigns,
  loading = false,
  title = 'Recent Campaigns',
}: CampaignTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Link
          href="/dashboard/campaigns"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Contacted</TableHead>
              <TableHead className="text-right">Responses</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No campaigns found
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map(campaign => (
                <TableRow
                  key={campaign.id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/campaigns/${campaign.id}`}
                      className="hover:text-blue-600"
                    >
                      {campaign.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)} variant="secondary">
                      {formatStatus(campaign.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.contactedCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.responseCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.contactedCount > 0
                      ? formatPercent(
                          (campaign.responseCount / campaign.contactedCount) * 100
                        )
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right text-gray-500">
                    {campaign.startDate
                      ? formatDate(campaign.startDate, 'MMM d')
                      : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
