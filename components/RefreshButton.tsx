'use client'

export default function RefreshButton() {
  return (
    <button
      className="refresh-btn"
      onClick={() => window.location.reload()}
      title="Refresh feed"
    >
      🔄
    </button>
  )
}
