import React, { ReactNode } from 'react'
import Input from './input'

interface FormProps {
  className?: string
  action: (state: any, formData: FormData) => void | Promise<void>
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
  const props = action ? { action: action } : { onSubmit: handleSubmit }
  return (
    <form className={`space-y-6 ${className ? className : ''}`} {...props}>
      {children}
    </form>
  )
}

interface FormControlProps {
  label?: string
  className?: string
  children: ReactNode
}

const FormControl = ({ label, className, children }: FormControlProps) => {
  return (
    <div className={`form-control ${className ? className : ''}`}>
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      {children}
    </div>
  )
}

Form.Input = Input
Form.FormControl = FormControl

export default Form
