import React, { ReactNode } from 'react'
import Input from './input'

interface FormProps {
  className?: string
  action?: () => FormData
  onSubmit?: () => Promise<void> | void | React.FormEvent<HTMLFormElement>
  children?: ReactNode
}

const Form = ({ className = '', action, onSubmit, children }: FormProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSubmit) {
      await onSubmit()
    }
  }
  return (
    <form
      className={`space-y-6 ${className ? className : ''}`}
      action={action}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  )
}

Form.Input = Input

export default Form
