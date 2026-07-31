'use client'

import { useState } from 'react'

export default function SubmitModal() {
  const [open, setOpen] = useState(false)
  const [headline, setHeadline] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('Events')
  const [location, setLocation] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const categories = ['Facilities', 'Events', 'Academics', 'Social News', 'Topics', 'Announcements']

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = file.name.split('.').pop()?.toLowerCase()
    const isVideo = ['mp4', 'mov', 'webm'].includes(ext || '')
    setMediaType(isVideo ? 'video' : 'image')
    setUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (json.url) {
        setMediaUrl(json.url)
        setMessage('')
      } else {
        setMediaUrl('')
        setMediaType('')
        setMessage(json.error || 'Upload failed')
      }
    } catch {
      setMediaUrl('')
      setMediaType('')
      setMessage('Upload error')
    }
    setUploading(false)
  }

  const submit = async () => {
    if (!headline.trim() || !body.trim()) { setMessage('Fill all fields'); return }
    if (uploading) { setMessage('Wait for upload to finish'); return }
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: headline.trim(),
          body: body.trim(),
          category,
          location,
          media_url: mediaUrl || null,
          media_type: mediaType || null,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        setMessage('Submitted for review!')
        setTimeout(() => {
          setOpen(false)
          setHeadline('')
          setBody('')
          setLocation('')
          setMediaUrl('')
          setMediaType('')
          setMessage('')
          window.location.reload()
        }, 1200)
      } else {
        setMessage(json.error || 'Failed to submit')
      }
    } catch {
      setMessage('Network error')
    }
    setLoading(false)
  }

  return (
    <>
      <button className="fab" onClick={() => setOpen(true)}>+</button>
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 14px', fontFamily: 'Fraunces, serif', color: 'var(--gold-bright)' }}>Submit a Tip</h3>
            <input placeholder="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} style={{ marginBottom: 10 }} />
            <textarea placeholder="What's happening?" rows={4} value={body} onChange={(e) => setBody(e.target.value)} style={{ marginBottom: 10 }} />
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginBottom: 10 }}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} style={{ marginBottom: 10 }} />

            <input type="file" accept="image/*,video/*" onChange={handleFile} style={{ marginBottom: 10, color: '#aaa' }} />
            {uploading && <div style={{ color: '#d4af37', fontSize: 12, marginBottom: 8 }}>Uploading media...</div>}

            {mediaUrl && (
              <div style={{ marginBottom: 10 }}>
                {mediaType === 'video'
                  ? <video src={mediaUrl} controls style={{ width: '100%', borderRadius: 10, maxHeight: 200 }} />
                  : <img src={mediaUrl} alt="preview" style={{ width: '100%', borderRadius: 10, maxHeight: 200, objectFit: 'cover' }} />
                }
              </div>
            )}

            {message && (
              <div style={{
                color: message.includes('Submitted') ? '#7fdb7f' : '#ff6b6b',
                fontSize: 13, marginBottom: 10,
                background: message.includes('Submitted') ? 'rgba(42,74,42,0.3)' : 'rgba(255,0,0,0.05)',
                padding: 8, borderRadius: 8
              }}>
                {message}
              </div>
            )}

            <button className="btn" onClick={submit} disabled={loading || uploading}>
              {uploading ? 'Uploading...' : loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
