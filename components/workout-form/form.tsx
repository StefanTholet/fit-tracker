import React, { ReactNode } from 'react'

interface FormProps {
  onSubmit?: any
  children: ReactNode
}

const Form = ({ onSubmit, children }: FormProps) => {
  return (
    <form
      className="w-full mx-auto mt-8 bg-white p-6 rounded-lg shadow-md"
      onSubmit={onSubmit}
    >
      {children}
    </form>
  )
}

export default Form
