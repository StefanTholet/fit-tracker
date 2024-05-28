// components/Footer.tsx
import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral text-neutral-content p-10 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4 md:mb-0">
            <h2 className="footer-title">Fit Tracker</h2>
            <p>
              Your ultimate companion for tracking workouts and achieving
              fitness goals.
            </p>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="footer-title">Quick Links</h2>
            <ul>
              <li>
                <a href="#" className="link link-hover">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Workouts
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="link link-hover">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="footer-title">Follow Us</h2>
            <div className="grid grid-flow-col gap-4">
              <a href="#" className="link link-hover">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M22.54 6.42a8.66 8.66 0 0 1-2.36.65 4.15 4.15 0 0 0 1.82-2.3 8.51 8.51 0 0 1-2.64 1A4.15 4.15 0 0 0 16 4c-2.27 0-4.12 1.86-4.12 4.13 0 .32.04.64.1.94-3.43-.17-6.47-1.8-8.51-4.28a4.14 4.14 0 0 0-.56 2.08c0 1.43.73 2.69 1.83 3.43a4.17 4.17 0 0 1-1.86-.51v.05c0 2 1.42 3.67 3.3 4.05-.34.1-.7.16-1.07.16-.26 0-.52-.02-.77-.07.53 1.66 2.06 2.87 3.87 2.9a8.34 8.34 0 0 1-6.15 1.72 11.78 11.78 0 0 0 6.35 1.86c7.62 0 11.78-6.31 11.78-11.78 0-.18 0-.35-.01-.53a8.4 8.4 0 0 0 2.1-2.14" />
                </svg>
              </a>
              <a href="#" className="link link-hover">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M18.36 2H5.64A3.64 3.64 0 0 0 2 5.64v12.72A3.64 3.64 0 0 0 5.64 22h12.72A3.64 3.64 0 0 0 22 18.36V5.64A3.64 3.64 0 0 0 18.36 2zm-7.6 15.56v-5.36H8.32v-2.56h2.44v-1.84c0-2.4 1.46-3.72 3.6-3.72.72 0 1.44.04 2.12.12v2.4h-1.48c-1.16 0-1.4.56-1.4 1.36v1.68h2.8l-.36 2.56h-2.44v5.36h-2.88z" />
                </svg>
              </a>
              <a href="#" className="link link-hover">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M12 2.04c-5.49 0-9.96 4.47-9.96 9.96 0 4.4 2.84 8.13 6.73 9.46.49.09.66-.21.66-.47v-1.68c-2.74.59-3.34-1.32-3.34-1.32-.44-1.12-1.09-1.42-1.09-1.42-.89-.61.07-.6.07-.6 1 .07 1.53 1.02 1.53 1.02.88 1.52 2.31 1.08 2.88.83.09-.64.34-1.08.61-1.33-2.19-.25-4.5-1.09-4.5-4.86 0-1.08.39-1.97 1.02-2.66-.1-.25-.45-1.28.1-2.67 0 0 .83-.27 2.73 1.02a9.47 9.47 0 0 1 2.5-.34c.85.01 1.71.11 2.5.34 1.89-1.29 2.72-1.02 2.72-1.02.56 1.39.21 2.42.11 2.67.63.69 1.01 1.58 1.01 2.66 0 3.79-2.32 4.61-4.52 4.85.35.3.66.89.66 1.79v2.65c0 .27.17.57.67.47 3.89-1.33 6.72-5.06 6.72-9.46 0-5.49-4.47-9.96-9.96-9.96z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
