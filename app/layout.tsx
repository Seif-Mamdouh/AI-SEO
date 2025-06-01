import './globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
  metadataBase: new URL('https://scan-med-spas.vercel.app'),
  title: 'MedSpaGPT - Analyze Your Med Spa & Cash Clinic',
  description:
    'Scan your med spa or cash clinic website in seconds and see how you stack up against competitors. Get SEO insights, find broken elements, and discover who\'s beating you.',
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
