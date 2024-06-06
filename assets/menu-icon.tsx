import React from 'react'

const MenuIcon = ({
  className = '',
  style = {},
}: {
  className: string
  style: object
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      width={'24px'}
      height={'24px'}
      stroke="currentColor"
      className={className}
      style={style}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  )
}

export default MenuIcon
