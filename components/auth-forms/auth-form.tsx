'use client'
import React, { ReactElement, ReactNode, useEffect, useRef } from 'react'
import { useFormState } from 'react-dom'
import useAlert from '@/hooks/useAlert'
import Form from '../form/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { redirect } from 'next/navigation'
import { AlertProps } from '@/interfaces/alert'

interface AuthFormProps {
  action: (
    prevState: any,
    formData: FormData
  ) => void | { error: string } | Promise<void | AlertProps>
  SubmitButton: ReactElement
  children?: ReactNode
}

const AuthForm = ({ SubmitButton, action, children }: AuthFormProps) => {
  const [state, formAction] = useFormState<any, FormData>(action, undefined)
  const { Alert } = useAlert()
  console.log(state)
  useEffect(() => {
    if (state && state?.variant === 'success') {
      console.log('redirecting')
    }
  }, [state])
  const ref = useRef(0)
  ref.current += 1
  console.log(ref.current)
  return (
    <Form action={formAction}>
      {state && (
        <Alert
          title={state.title}
          message={state.message}
          variant={state.variant}
        />
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

      <Form.FormControl className="mt-6">
        <button>Login</button>
      </Form.FormControl>
      {children}
    </Form>
  )
}

export default AuthForm
