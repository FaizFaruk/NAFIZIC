'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function EditorLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const login = async () => {
    setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMsg(error.message)
    else window.location.href = '/editor/dashboard'
  }

  return (
    <div className="container" style={{ paddingTop: 80, maxWidth: 400 }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', color: 'var(--gold-bright)', textAlign: 'center' }}>Editor Login</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: 10 }} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: 10 }} />
      {msg && <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 10 }}>{msg}</div>}
      <button className="btn" onClick={login} style={{ width: '100%' }}>Sign In</button>
    </div>
  )
}
