import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold text-gray-800">
          Fit Tracker
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-800"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/add-workouts"
                className="text-gray-600 hover:text-gray-800"
              >
                Add Workouts
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
