'use client'
import React, { ReactElement, ReactNode } from 'react'
import { useFormState } from 'react-dom'
import Form from '../form/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

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
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email"> Email</Label>
        <Input id="email" name="email" type="email" placeholder="email" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="password"
        />
      </div>

      <Form.FormControl className="mt-6">{SubmitButton}</Form.FormControl>
      {children}
    </Form>
  )
}

export default AuthForm
