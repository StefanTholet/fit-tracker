import Link from 'next/link'
import React from 'react'
import LogoutForm from './logout-form/logout-form'
import { getSession } from '@/actions/auth-actions'

type LinkType = {
  href: string
  label: string
}

const AUTHENTICATED_LINKS: LinkType[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/add-workouts', label: 'Add Workouts' },
]

const GUEST_LINKS: LinkType[] = [
  { href: '/login', label: 'Login' },
  { href: '/signup', label: 'Signup' },
]

const Header = async () => {
  const session = await getSession()
  const links: LinkType[] = session.isLoggedIn
    ? AUTHENTICATED_LINKS
    : GUEST_LINKS
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-lg font-semibold text-gray-800">
          Fit Tracker
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {session.isLoggedIn && (
              <li>
                <LogoutForm />
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
