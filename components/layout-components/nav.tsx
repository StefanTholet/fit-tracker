'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import LogoutForm from '@/components/auth-forms/logout-form/logout-form'
import MenuIcon from '@/assets/menu-icon'
import CloseIcon from '@/assets/svg/close-icon'
import { LinkType } from './header'

const Nav = ({ links }: { links: LinkType[] }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)
  return (
    <div className="container mx-auto px-4 flex justify-between items-center">
      <Link
        onClick={() => setMenuOpen(false)}
        href="/"
        className="text-2xl font-bold text-white tracking-wide"
      >
        Fit Tracker
      </Link>
      <div className="lg:hidden">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {menuOpen ? (
            <CloseIcon className="absolute top-1" style={{ left: '93%' }} />
          ) : (
            <MenuIcon className="absolute top-1" style={{ left: '93%' }} />
          )}
        </button>
      </div>
      <nav
        className={`lg:flex lg:items-center lg:space-x-6 transition-all duration-300 ease-in-out ${
          menuOpen
            ? 'max-h-screen opacity-100'
            : 'max-h-0 opacity-0 lg:opacity-100 lg:max-h-full overflow-hidden'
        }`}
      >
        <ul className={`flex flex-col lg:flex-row lg:space-x-6 mt-4 lg:mt-0`}>
          {links.map((link) => (
            <li key={link.label} className="my-2 lg:my-0">
              <Link
                onClick={toggleMenu}
                href={link.href}
                className="text-white text-lg hover:text-gray-200 transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
          {true && (
            <li className="text-white text-lg hover:text-gray-200 transition-colors duration-200">
              <LogoutForm />
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}

export default Nav
