import React from 'react'

const CloseIcon = ({
  className = '',
  style = {},
  onClick
}: {
  className?: string
  style?: object
  onClick?: () => void
}) => {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={'24px'}
      height={'24px'}
      className={className}
      style={style}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  )
}

export default CloseIcon
