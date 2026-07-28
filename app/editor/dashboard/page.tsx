import { supabaseAdmin, createServerSupabaseClient } from '@/lib/supabase'
import { formatTimeAgo } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function EditorDashboard() {
  const authSupabase = createServerSupabaseClient()
  const { data: { user } } = await authSupabase.auth.getUser()
  if (!user) redirect('/editor/login')

  const { data: pendingTips } = await supabaseAdmin
    .from('tips')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  const { data: recentApproved } = await supabaseAdmin
    .from('tips')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(10)

  async function approveTip(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await supabaseAdmin.from('tips').update({ status: 'approved' }).eq('id', id)
    revalidatePath('/editor/dashboard')
    revalidatePath('/')
  }

  async function rejectTip(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await supabaseAdmin.from('tips').update({ status: 'rejected' }).eq('id', id)
    revalidatePath('/editor/dashboard')
  }

  async function createPost(formData: FormData) {
    'use server'
    const headline = (formData.get('headline') as string)?.trim()
    const body = (formData.get('body') as string)?.trim()
    const category = formData.get('category') as string
    const location = (formData.get('location') as string) || null
    if (!headline || !body || !category) return
    await supabaseAdmin.from('tips').insert({
      headline, body, category, location,
      status: 'approved',
      posted_by: 'NAFIZIC',
    } as any)
    revalidatePath('/editor/dashboard')
    revalidatePath('/')
  }

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 100 }}>
      <div className="demo-note" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', padding: '12px 16px', borderRadius: 12, marginBottom: 24 }}>
        <strong>Editor Dashboard</strong> — You are signed in as {user.email}.
        <form action="/api/auth/signout" method="post" style={{ display: 'inline', marginLeft: 12 }}>
          <button type="submit" className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: 12 }}>Sign out</button>
        </form>
      </div>

      <div className="editor-form">
        <h3 style={{ margin: '0 0 12px', fontFamily: 'Fraunces, serif', color: 'var(--gold-bright)', fontSize: 16 }}>Create a Post as NAFIZIC</h3>
        <form action={createPost}>
          <input name="headline" placeholder="Headline" required style={{ marginBottom: 8 }} />
          <textarea name="body" placeholder="Body text" rows={3} required style={{ marginBottom: 8 }} />
          <select name="category" required style={{ marginBottom: 8 }}>
            {['Facilities', 'Events', 'Academics', 'Social News', 'Topics', 'Announcements'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input name="location" placeholder="Location (optional)" style={{ marginBottom: 10 }} />
          <button type="submit" className="btn">Publish as NAFIZIC</button>
        </form>
      </div>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 22, color: 'var(--gold-bright)', marginBottom: 16 }}>
        Pending tips <span className="admin-badge">EDITOR ONLY</span>
      </h2>
      <div>
        {(!pendingTips || pendingTips.length === 0) ? (
          <div className="empty">Queue's empty. Nothing waiting on review right now.</div>
        ) : (
          pendingTips.map((p: any) => (
            <div key={p.id} className="pending-card">
              <span className="tag">{p.category}</span>
              <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>submitted {formatTimeAgo(p.created_at)}</div>
              <h3 className="headline" style={{ fontSize: 17 }}>{p.headline}</h3>
              <p className="body-text">{p.body}</p>
              {p.media_url && (
                <div className="media-wrap">
                  {p.media_type === 'video' ? <video controls src={p.media_url} style={{ maxHeight: 300 }} /> : <img src={p.media_url} alt={p.headline} style={{ maxHeight: 300, objectFit: 'contain' }} />}
                </div>
              )}
              <div className="location">📍 {p.location || 'Campus'}</div>
              <div className="pending-actions">
                <form action={approveTip}><input type="hidden" name="id" value={p.id} /><button type="submit" className="btn btn-approve">Approve & publish</button></form>
                <form action={rejectTip}><input type="hidden" name="id" value={p.id} /><button type="submit" className="btn btn-reject">Reject</button></form>
              </div>
            </div>
          ))
        )}
      </div>

      <h2 style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 20, color: 'var(--gold-bright)', marginTop: 40, marginBottom: 16 }}>Recently published</h2>
      <div>
        {(!recentApproved || recentApproved.length === 0) ? (
          <div className="empty">No published posts yet.</div>
        ) : (
          recentApproved.map((p: any) => (
            <div key={p.id} className="pending-card" style={{ opacity: 0.8 }}>
              <span className="tag">{p.category}</span>
              <h3 className="headline" style={{ fontSize: 16, marginBottom: 4 }}>{p.headline}</h3>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>Published {formatTimeAgo(p.created_at)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
