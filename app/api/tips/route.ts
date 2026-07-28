import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function POST(request: NextRequest) {
  try {
    const admin = getAdminClient()
    const body = await request.json()

    if (!body.headline || !body.body || !body.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (body.headline.length > 200 || body.body.length > 2000) {
      return NextResponse.json({ error: 'Content too long' }, { status: 400 })
    }
    const validCategories = ['Facilities', 'Events', 'Academics', 'Social News', 'Topics', 'Announcements']
    if (!validCategories.includes(body.category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    const { data, error } = await admin
      .from('tips')
      .insert({
        category: body.category,
        headline: body.headline.trim(),
        body: body.body.trim(),
        location: body.location || null,
        media_url: body.media_url || null,
        media_type: body.media_type || null,
        status: 'pending',
        posted_by: body.posted_by || null,
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save tip' }, { status: 500 })
    }
    return NextResponse.json({ success: true, tip: data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const admin = getAdminClient()
    const { data, error } = await admin
      .from('tips')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch tips' }, { status: 500 })
    }
    return NextResponse.json({ tips: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
