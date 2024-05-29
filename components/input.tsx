import React, { ReactNode } from 'react'

interface InputProps {
  name: string
  type: string
  id?: string
  placeholder: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  className?: string
  children?: ReactNode
}

const Input = ({
  type = 'text',
  name = '',
  id = '',
  placeholder = '',
  onChange,
  value = '',
  className = '',
  children,
}: InputProps) => {
  return (
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input input-bordered w-full ${className ? className : ''}`}
    >
      {children}
    </input>
  )
}

export default Input
