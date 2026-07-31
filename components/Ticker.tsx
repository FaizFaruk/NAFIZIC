'use client'

export default function Ticker({ tips }: { tips: any[] }) {
  const headlines = tips.length > 0 ? tips.map(t => t.headline) : ['Welcome to NAFIZIC — Campus intel, verified']
  const text = headlines.join(' · ')
  return (
    <div className="ticker">
      <div className="ticker-inner">
        <span style={{ color: 'var(--gold-bright)', fontSize: '13px', fontWeight: 500 }}>{text} · {text} · </span>
      </div>
    </div>
  )
}
