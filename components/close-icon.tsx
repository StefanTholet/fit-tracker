import React from 'react'

interface CloseIconProps {
  onClick: () => void
  className?: string
}

const CloseIcon: React.FC<CloseIconProps> = ({ onClick, className = '' }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    className={`w-6 h-6 cursor-pointer ${className ? className : ''}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

export default CloseIcon
