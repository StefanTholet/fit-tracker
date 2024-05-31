'use client'
import React, { ReactElement, ReactNode } from 'react'
import { useFormState } from 'react-dom'
import Form from '../form/form'

interface AuthFormProps {
  action: (
    prevState: any,
    formData: FormData
  ) => void | { error: string } | Promise<void | { error: string }>
  SubmitButton: ReactElement
  children?: ReactNode
}
const AuthForm = ({ SubmitButton, action, children }: AuthFormProps) => {
  const [state, formAction] = useFormState<any, FormData>(action, undefined)

  return (
    <Form action={formAction}>
      {state?.error && (
        <p className="text-red-800 text-center">{state.error}</p>
      )}
      <Form.FormControl label="Email">
        <Form.Input id="email" name="email" type="email" placeholder="email" />
      </Form.FormControl>
      <Form.FormControl label="Password">
        <Form.Input
          id="password"
          name="password"
          type="password"
          placeholder="password"
        />
      </Form.FormControl>
      <Form.FormControl className="mt-6">{SubmitButton}</Form.FormControl>
      {children}
    </Form>
  )
}

export default AuthForm
