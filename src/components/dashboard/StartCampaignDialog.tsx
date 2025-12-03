'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Play, Loader2 } from 'lucide-react'

interface StartCampaignDialogProps {
  trigger?: React.ReactNode
}

export function StartCampaignDialog({ trigger }: StartCampaignDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [campaignName, setCampaignName] = useState('')
  const [batchSize, setBatchSize] = useState('50')
  const [maxProspects, setMaxProspects] = useState('1000')
  const [language, setLanguage] = useState<'all' | 'nl' | 'fr'>('all')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!campaignName.trim()) {
      toast.error('Please enter a campaign name')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/campaigns/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName: campaignName.trim(),
          batchSize: parseInt(batchSize),
          maxProspects: parseInt(maxProspects),
          filters: language !== 'all' ? { language } : undefined,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Campaign started', {
          description: result.data?.message || 'Campaign is now running',
        })
        setOpen(false)
        setCampaignName('')
        router.refresh()
      } else {
        toast.error('Failed to start campaign', {
          description: result.error?.message || 'An error occurred',
        })
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Start Campaign
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start New Campaign</DialogTitle>
          <DialogDescription>
            Configure and launch a new outreach campaign. This will trigger the
            N8N workflow to start contacting prospects.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="campaignName" className="text-sm font-medium">
                Campaign Name
              </label>
              <Input
                id="campaignName"
                placeholder="e.g., December Outreach"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="batchSize" className="text-sm font-medium">
                Batch Size
              </label>
              <Select
                value={batchSize}
                onValueChange={setBatchSize}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select batch size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 prospects per batch</SelectItem>
                  <SelectItem value="25">25 prospects per batch</SelectItem>
                  <SelectItem value="50">50 prospects per batch</SelectItem>
                  <SelectItem value="100">100 prospects per batch</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Number of prospects to contact before pausing
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="maxProspects" className="text-sm font-medium">
                Max Prospects
              </label>
              <Input
                id="maxProspects"
                type="number"
                min="1"
                max="5000"
                value={maxProspects}
                onChange={(e) => setMaxProspects(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                Maximum total prospects to contact in this campaign
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="language" className="text-sm font-medium">
                Language Filter
              </label>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as 'all' | 'nl' | 'fr')}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="nl">Dutch (NL)</SelectItem>
                  <SelectItem value="fr">French (FR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Campaign
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
