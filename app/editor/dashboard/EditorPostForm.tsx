'use client'

import { useState } from 'react'
import { createPost } from './actions'

export default function EditorPostForm() {
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaType, setMediaType] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = file.name.split('.').pop()?.toLowerCase()
    const isVideo = ['mp4', 'mov', 'webm'].includes(ext || '')
    setMediaType(isVideo ? 'video' : 'image')
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (json.url) {
        setMediaUrl(json.url)
      } else {
        setError(json.error || 'Upload failed')
        setMediaUrl('')
        setMediaType('')
      }
    } catch {
      setError('Upload error')
      setMediaUrl('')
      setMediaType('')
    }
    setUploading(false)
  }

  async function handleSubmit(formData: FormData) {
    if (uploading) { setError('Wait for upload to finish'); return }
    setPending(true)
    setSuccess(false)
    setError('')

    if (mediaUrl) {
      formData.append('media_url', mediaUrl)
      formData.append('media_type', mediaType)
    }

    const result = await createPost(formData)
    setPending(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      const form = document.getElementById('editor-post-form') as HTMLFormElement
      form?.reset()
      setMediaUrl('')
      setMediaType('')
      setTimeout(() => setSuccess(false), 4000)
    }
  }

  return (
    <div className="editor-form">
      <h3 style={{ margin: '0 0 12px', fontFamily: 'Fraunces, serif', color: 'var(--gold-bright)', fontSize: 16 }}>
        Create a Post as NAFIZIC
      </h3>

      {success && (
        <div className="success-banner">
          ✅ Post published successfully! It now appears on the homepage.
        </div>
      )}
      {error && (
        <div style={{ color: '#ff6b6b', fontSize: 13, marginBottom: 10, background: 'rgba(255,0,0,0.05)', padding: 8, borderRadius: 8 }}>
          {error}
        </div>
      )}

      <form id="editor-post-form" action={handleSubmit}>
        <input name="headline" placeholder="Headline" required style={{ marginBottom: 8 }} />
        <textarea name="body" placeholder="Body text" rows={3} required style={{ marginBottom: 8 }} />
        <select name="category" required style={{ marginBottom: 8 }}>
          {['Facilities', 'Events', 'Academics', 'Social News', 'Topics', 'Announcements'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="location" placeholder="Location (optional)" style={{ marginBottom: 8 }} />
        <input type="file" accept="image/*,video/*" onChange={handleFile} style={{ marginBottom: 8, color: '#aaa' }} />

        {uploading && <div style={{ color: '#d4af37', fontSize: 12, marginBottom: 8 }}>Uploading media...</div>}

        {mediaUrl && (
          <div style={{ marginBottom: 10 }}>
            {mediaType === 'video'
              ? <video src={mediaUrl} controls style={{ width: '100%', borderRadius: 10, maxHeight: 200 }} />
              : <img src={mediaUrl} alt="preview" style={{ width: '100%', borderRadius: 10, maxHeight: 200, objectFit: 'cover' }} />
            }
          </div>
        )}

        <button type="submit" className="btn" disabled={pending || uploading}>
          {uploading ? 'Uploading...' : pending ? 'Publishing...' : 'Publish as NAFIZIC'}
        </button>
      </form>
    </div>
  )
}
