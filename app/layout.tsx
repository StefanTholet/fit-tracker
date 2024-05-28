import type { Metadata } from 'next'
import Header from '@/components/header'
import Hero from '@/components/hero'
import Footer from '@/components/footer'
import '../styles/global.css'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="site-wrapper">
          <Header />
          <Hero />
          <div className="pb-14">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
