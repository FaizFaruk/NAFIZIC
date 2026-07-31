'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function EditorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    if (!email.trim() || !password.trim()) {
      setMsg('Enter email and password')
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMsg(error.message)
        setLoading(false)
      } else if (data.session) {
        // Cookie is now set by createBrowserClient — middleware will see it
        window.location.assign('/editor/dashboard')
      } else {
        setMsg('Login failed. Please try again.')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setMsg('Cannot connect to server. Check your internet.')
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: 80, maxWidth: 400 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <svg width="64" height="64" viewBox="0 0 48 48" fill="none" style={{ marginBottom: 12 }}>
          <rect x="2" y="2" width="44" height="44" rx="10" stroke="#d4af37" strokeWidth="2" fill="none"/>
          <path d="M14 36V12h4l12 16V12h4v24h-4L18 20v16h-4z" fill="#d4af37"/>
          <circle cx="36" cy="12" r="3" fill="#d4af37"/>
        </svg>
        <h1 style={{ fontFamily: 'Fraunces, serif', color: 'var(--gold-bright)', margin: 0 }}>NAFIZIC</h1>
        <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Editor Login</p>
      </div>

      <form onSubmit={login}>
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: 10 }} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: 10 }} required />

        {msg && <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 10, textAlign: 'center' }}>{msg}</div>}

        <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <a href="/" style={{ color: '#666', textDecoration: 'none', fontSize: 13 }}>← Back to Home</a>
      </div>
    </div>
  )
}
