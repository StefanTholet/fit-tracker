import React, { ReactNode } from 'react'
import { TailwindClasses } from '@/types/tailwind'

interface ButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

const Button = ({ className, onClick, children }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`btn bg-primary-focus text-white ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
