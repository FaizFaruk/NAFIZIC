'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { formatTimeAgo } from '@/lib/utils'

export default function Feed({ initialTips }: { initialTips: any[] }) {
  const [tips] = useState(initialTips)

  if (!tips || tips.length === 0) {
    return <div className="empty">No posts yet. Be the first to submit!</div>
  }

  return (
    <div>
      {tips.map((tip, i) => (
        <TipCard key={tip.id} tip={tip} index={i} />
      ))}
    </div>
  )
}

function TipCard({ tip, index }: { tip: any; index: number }) {
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState('')
  const [commentCount, setCommentCount] = useState(0)
  const [error, setError] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const isEditorPost = !!tip.posted_by

  useEffect(() => {
    if (tip.media_type === 'video' && videoRef.current && cardRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) videoRef.current?.play()
            else videoRef.current?.pause()
          })
        },
        { threshold: 0.6 }
      )
      observer.observe(cardRef.current)
      return () => observer.disconnect()
    }
  }, [tip.media_type])

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?tip_id=${tip.id}`)
      const json = await res.json()
      setComments(json.comments || [])
      setCommentCount((json.comments || []).length)
    } catch {}
  }, [tip.id])

  useEffect(() => {
    if (commentsOpen) fetchComments()
  }, [commentsOpen, fetchComments])

  const postComment = async () => {
    if (!commentText.trim()) return
    setError('')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tip_id: tip.id, body: commentText.trim() }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Failed to post')
        return
      }
      setCommentText('')
      await fetchComments()
    } catch {
      setError('Network error')
    }
  }

  return (
    <div ref={cardRef} className="card" style={{ animation: `fadeIn 0.4s ease ${index * 0.05}s both` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="tag">{tip.category}</span>
        <span className="seal">
          {isEditorPost ? '✓ Verified by editor' : '✓ Posted by editor'}
        </span>
      </div>

      <h3 className="headline">{tip.headline}</h3>
      <p className="body-text">{tip.body}</p>

      {tip.media_url && (
        <div className="media-wrap">
          {tip.media_type === 'video' ? (
            <VideoPlayer src={tip.media_url} />
          ) : (
            <img src={tip.media_url} alt={tip.headline} loading="lazy" />
          )}
        </div>
      )}

      <div className="location">📍 {tip.location || 'Campus'}</div>

      {isEditorPost && (
        <div className="byline" style={{ color: 'var(--gold-bright)', fontWeight: 600 }}>
          by NAFIZIC
        </div>
      )}

      <div style={{ marginTop: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
        <button onClick={() => setCommentsOpen(!commentsOpen)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          💬 {commentCount > 0 ? commentCount : 'Comment'}
        </button>
      </div>

      {commentsOpen && (
        <div className="comment-box">
          <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 8 }}>
            {comments.length === 0 ? (
              <div style={{ color: '#555', fontSize: 12, padding: '4px 0' }}>No comments yet</div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="comment">
                  <span style={{ color: '#ccc' }}>{c.body}</span>
                  <span className="comment-time">{formatTimeAgo(c.created_at)}</span>
                </div>
              ))
            )}
          </div>
          {error && <div style={{ color: '#ff6b6b', fontSize: 12, marginBottom: 6 }}>{error}</div>}
          <textarea
            className="comment-input"
            rows={2}
            placeholder="Say something..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); postComment() }}}
          />
          <button className="comment-btn" onClick={postComment}>Post</button>
        </div>
      )}
    </div>
  )
}

function VideoPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (ref.current) {
      ref.current.muted = !muted
      setMuted(!muted)
    }
  }

  const togglePlay = () => {
    if (!ref.current) return
    if (ref.current.paused) { ref.current.play(); setPlaying(true) }
    else { ref.current.pause(); setPlaying(false) }
  }

  return (
    <div className="video-wrap" onClick={togglePlay}>
      <video ref={ref} src={src} loop muted playsInline autoPlay style={{ width: '100%', display: 'block', maxHeight: 500, objectFit: 'cover' }} />
      {!playing && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--gold-bright)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#000' }}>▶</div>
        </div>
      )}
      <button className="mute-btn" onClick={toggleMute}>{muted ? '🔇' : '🔊'}</button>
    </div>
  )
}
