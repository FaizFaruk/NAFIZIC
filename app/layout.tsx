export const metadata = { title: 'NAFIZIC', description: 'Campus intel, verified' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif', background: '#0a0a0a', color: '#e5e5e5' }}>{children}</body>
    </html>
  )
}
