import React, { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  type?:
    | 'primary'
    | 'primary-2'
    | 'primary-3'
    | 'neutral'
    | 'neutral-2'
    | 'accent'
    | 'accent-2'
    | 'info'
    | 'info-2'
    | 'success'
    | 'success-2'
    | 'warning'
    | 'warning-2'
    | 'error'
    | 'error-2'
}

const CLASS_MAPPER = {
  primary: 'btn-primary',
  'primary-2': 'bg-primary-2',
  'primary-3': 'bg-primary-focus-2',
  neutral: 'btn-neutral',
  'neutral-2': 'bg-neutral-2',
  accent: 'btn-accent',
  'accent-2': 'bg-accent-2',
  info: 'btn-info',
  'info-2': 'bg-info-2',
  success: 'btn-success',
  'success-2': 'bg-success-2',
  warning: 'btn-warning',
  'warning-2': 'bg-warning-2',
  error: 'btn-error',
  'error-2': 'bg-error-2'
}

const Button = ({ className, type, onClick, children }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`btn  text-white ${
        type ? CLASS_MAPPER[type] : ''
      } ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
