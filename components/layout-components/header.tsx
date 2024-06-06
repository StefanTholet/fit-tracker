import Nav from './nav'
import { getSession } from '@/server-actions/auth-actions'

export type LinkType = {
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
  const isLoggedIn = session.isLoggedIn
  const links: LinkType[] = isLoggedIn ? AUTHENTICATED_LINKS : GUEST_LINKS

  return (
    <header className="relative bg-gradient-to-r from-blue-500 to-purple-600 shadow-md py-4">
      <Nav links={links} />
    </header>
  )
}

export default Header
