import React, { ReactNode } from 'react'

interface InputProps {
  name: string
  type: string
  id?: string
  disabled?: boolean
  placeholder: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value?: string | number
  className?: string
  children?: ReactNode
  rest?: any
}

const Input = ({
  type = 'text',
  name = '',
  id = '',
  placeholder = '',
  onChange,
  value,
  className = '',
  disabled,
  children,
  rest = {}
}: InputProps) => {
  return (
    <input
      disabled={disabled}
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input input-bordered w-full ${className ? className : ''}`}
      {...rest}
    >
      {children}
    </input>
  )
}

export default Input
