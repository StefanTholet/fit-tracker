// components/Header.js
import React from 'react'

const Header = () => {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="text-lg font-semibold text-gray-800">
          Fit Tracker
        </a>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-gray-800">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
