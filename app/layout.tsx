import type { Metadata } from 'next'
import { NextUIProvider } from '@nextui-org/system'
import Header from '@/components/layout-components/header'
import Hero from '@/components/layout-components/hero'
import Footer from '@/components/layout-components/footer'
import '../styles/global.css'
import { getSession } from '@/server-actions/auth-actions'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  //TO DO - think of a better way to gain access to session data
  const session = await getSession()

  return (
    <html lang="en">
      <NextUIProvider>
        <body>
          <div className="site-wrapper">
            <Header />
            <Hero userId={session.userId} />
            <div className="page-container">{children}</div>
            <Footer />
          </div>
        </body>
      </NextUIProvider>
    </html>
  )
}
