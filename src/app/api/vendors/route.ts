import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const sortBy = searchParams.get('sortBy') || 'reconnection_rate'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const supabase = await createClient()

    // Use vendor_performance view
    let query = supabase
      .from('vendor_performance')
      .select('*', { count: 'exact' })

    // Apply sorting
    const ascending = sortOrder === 'asc'
    switch (sortBy) {
      case 'name':
        query = query.order('vendor_name', { ascending })
        break
      case 'total_prospects':
        query = query.order('total_prospects', { ascending })
        break
      case 'reconnection_rate':
      default:
        query = query.order('reconnection_rate', { ascending, nullsFirst: false })
        break
    }

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data: vendors, error, count } = await query

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: 'QUERY_ERROR', message: error.message } },
        { status: 500 }
      )
    }

    // Transform to expected format
    const formattedVendors = (vendors || []).map(v => ({
      vendorId: v.vendor_id,
      vendorName: v.vendor_name,
      vendorEmail: v.vendor_email,
      totalProspects: v.total_prospects || 0,
      totalResponses: v.total_responses || 0,
      callbacks: v.callbacks || 0,
      interestedProspects: v.interested_prospects || 0,
      notInterestedProspects: v.not_interested_prospects || 0,
      reconnectionRate: v.reconnection_rate || 0,
    }))

    return NextResponse.json({
      success: true,
      data: formattedVendors,
      meta: {
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    })
  } catch (error) {
    console.error('Vendors API error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
