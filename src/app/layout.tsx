import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Azure Learning Tracker',
  description: '21-day Azure cloud engineering learning journey — identity, security, and DevOps',
  openGraph: {
    title: 'Azure Learning Tracker',
    description: '21-day Azure cloud engineering learning journey',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-surface-900 antialiased">
        {children}
      </body>
    </html>
  )
}
