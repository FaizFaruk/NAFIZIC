export const metadata = { title: 'Policies & Guidelines | NAFIZIC' }

export default function PoliciesPage() {
  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 100 }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', color: 'var(--gold-bright)', fontSize: 28, marginBottom: 8 }}>Policies & Guidelines</h1>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>How NAFIZIC keeps campus intel trustworthy.</p>

      <div className="card">
        <h3 style={{ color: '#d4af37', marginTop: 0 }}>Anonymous Submissions</h3>
        <p className="body-text">All tips are submitted anonymously. We do not collect names, emails, or any identifying information from public submissions.</p>
      </div>

      <div className="card">
        <h3 style={{ color: '#d4af37', marginTop: 0 }}>Editor Review</h3>
        <p className="body-text">Every post is reviewed by a verified editor before going live. This prevents misinformation and keeps the feed clean.</p>
      </div>

      <div className="card">
        <h3 style={{ color: '#d4af37', marginTop: 0 }}>Content Rules</h3>
        <p className="body-text">No hate speech, harassment, or false claims. Posts must be relevant to campus life. Editors reserve the right to reject any submission.</p>
      </div>

      <div className="card">
        <h3 style={{ color: '#d4af37', marginTop: 0 }}>Media Uploads</h3>
        <p className="body-text">Photos and videos are moderated. Upload only content you have the right to share. Max file size applies.</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <a href="/" style={{ color: '#d4af37', textDecoration: 'none', fontSize: 14 }}>← Back to Home</a>
      </div>
    </div>
  )
}
