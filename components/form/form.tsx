import React, { ReactNode } from 'react'
import Input from './input'
import { QueryResponseMessage } from '@/interfaces/workout'
import CloseIcon from '@/assets/svg/close-icon'

interface FormProps {
  className?: string
  action?: any
  onSubmit?: (
    ...args: any
  ) =>
    | Promise<void>
    | void
    | React.FormEvent<HTMLFormElement>
    | Promise<QueryResponseMessage>
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

const Container = ({
  className,
  children
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div className={`flex flex-wrap gap-4 ${className ? className : ''}`}>
      {children}
    </div>
  )
}

const Row = ({
  className,
  children
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div
      className={`relative flex-1 p-4 border rounded-md bg-base-100 ${
        className ? className : ''
      }`}
    >
      {children}
    </div>
  )
}

const FormHeader = ({
  title,
  children,
  closeForm
}: {
  title: string
  children?: ReactNode
  closeForm?: () => void
}) => {
  return (
    <>
      {closeForm && (
        <button className="block ml-auto">
          <CloseIcon onClick={closeForm} />
        </button>
      )}
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </>
  )
}

const SubHeader = ({
  className,
  subTitle,
  children
}: {
  className?: string
  subTitle: string
  children?: ReactNode
}) => {
  return (
    <div className={`flex justify-between ${className ? className : ''}`}>
      <p className="font-bold mb-2">{subTitle}</p>
      {children}
    </div>
  )
}

Form.Header = FormHeader
Form.Input = Input
Form.FormControl = FormControl
Form.Container = Container
Form.Row = Row
Form.SubHeader = SubHeader

export default Form
