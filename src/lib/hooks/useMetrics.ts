'use client'

import useSWR from 'swr'
import { KPIData, HeatmapData, FunnelData, TrendDataPoint, Campaign, VendorPerformance } from '@/types/dashboard'
import { REFRESH_INTERVAL } from '@/lib/utils/constants'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  const json = await res.json()
  if (!json.success) throw new Error(json.error?.message || 'API error')
  return json.data
}

export function useMetrics(campaignId?: string) {
  const params = new URLSearchParams()
  if (campaignId) params.set('campaignId', campaignId)

  const { data, error, isLoading, mutate } = useSWR<KPIData>(
    `/api/metrics?${params.toString()}`,
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  )

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  }
}

export function useHeatmap(campaignId?: string) {
  const params = new URLSearchParams()
  if (campaignId) params.set('campaignId', campaignId)

  const { data, error, isLoading, mutate } = useSWR<HeatmapData>(
    `/api/metrics/heatmap?${params.toString()}`,
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  )

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  }
}

export function useFunnel(campaignId?: string) {
  const params = new URLSearchParams()
  if (campaignId) params.set('campaignId', campaignId)

  const { data, error, isLoading, mutate } = useSWR<FunnelData>(
    `/api/metrics/funnel?${params.toString()}`,
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  )

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  }
}

export function useTrends(interval: 'daily' | 'weekly' = 'daily') {
  const params = new URLSearchParams()
  params.set('interval', interval)

  const { data, error, isLoading, mutate } = useSWR<{ rawData: TrendDataPoint[] }>(
    `/api/metrics/trends?${params.toString()}`,
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  )

  return {
    data: data?.rawData || [],
    error,
    isLoading,
    refresh: mutate,
  }
}

export function useCampaigns(page = 1, pageSize = 10) {
  const params = new URLSearchParams()
  params.set('page', page.toString())
  params.set('pageSize', pageSize.toString())

  const { data, error, isLoading, mutate } = useSWR<Campaign[]>(
    `/api/campaigns?${params.toString()}`,
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  )

  return {
    data: data || [],
    error,
    isLoading,
    refresh: mutate,
  }
}

export function useVendors(page = 1, pageSize = 10) {
  const params = new URLSearchParams()
  params.set('page', page.toString())
  params.set('pageSize', pageSize.toString())

  const { data, error, isLoading, mutate } = useSWR<VendorPerformance[]>(
    `/api/vendors?${params.toString()}`,
    fetcher,
    { refreshInterval: REFRESH_INTERVAL }
  )

  return {
    data: data || [],
    error,
    isLoading,
    refresh: mutate,
  }
}
