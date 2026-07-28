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
    if (!body.tip_id || !body.body?.trim()) {
      return NextResponse.json({ error: 'Missing tip_id or body' }, { status: 400 })
    }
    const { data: tip } = await admin
      .from('tips')
      .select('id')
      .eq('id', body.tip_id)
      .eq('status', 'approved')
      .single()
    if (!tip) {
      return NextResponse.json({ error: 'Tip not found' }, { status: 404 })
    }
    const { data, error } = await admin
      .from('comments')
      .insert({ tip_id: body.tip_id, body: body.body.trim() } as any)
      .select()
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, comment: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = getAdminClient()
    const tipId = new URL(request.url).searchParams.get('tip_id')
    if (!tipId) {
      return NextResponse.json({ error: 'tip_id required' }, { status: 400 })
    }
    const { data } = await admin
      .from('comments')
      .select('*')
      .eq('tip_id', tipId)
      .order('created_at', { ascending: true })
    return NextResponse.json({ comments: data || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 })
  }
}
