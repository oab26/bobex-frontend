'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { StartCampaignDialog } from '@/components/dashboard/StartCampaignDialog'
import { useCampaigns } from '@/lib/hooks/useMetrics'
import { formatDate, formatStatus, getStatusColor, formatPercent } from '@/lib/utils/formatters'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

export default function CampaignsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const pageSize = 20

  const { data: campaigns, isLoading } = useCampaigns(page, pageSize)

  // Filter campaigns by status (client-side for now)
  const filteredCampaigns = statusFilter === 'all'
    ? campaigns
    : campaigns.filter(c => c.status === statusFilter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-500">
            Manage and monitor your outreach campaigns
          </p>
        </div>
        <StartCampaignDialog />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search campaigns..."
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Contacted</TableHead>
                    <TableHead className="text-right">Responses</TableHead>
                    <TableHead className="text-right">Qualified</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Started</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                        No campaigns found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns.map(campaign => (
                      <TableRow key={campaign.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <Link
                            href={`/dashboard/campaigns/${campaign.id}`}
                            className="hover:text-blue-600"
                          >
                            {campaign.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(campaign.status)}
                            variant="secondary"
                          >
                            {formatStatus(campaign.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.totalProspects.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.contactedCount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.responseCount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.qualifiedCount.toLocaleString()}
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
                            ? formatDate(campaign.startDate, 'MMM d, yyyy')
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Showing {filteredCampaigns.length} campaigns
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">Page {page}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={filteredCampaigns.length < pageSize}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
