'use client'
import React, { ReactNode, useEffect } from 'react'
import { useToast } from '../ui/use-toast'
import { useFormState } from 'react-dom'
import Form from '../form/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { AlertProps } from '@/interfaces/alert'

interface AuthFormProps {
  action: (
    prevState: any,
    formData: FormData
  ) => { error: string } | Promise<void | AlertProps>
  type: 'Login' | 'Signup'
  children?: ReactNode
}

const AuthForm = ({ type, action, children }: AuthFormProps) => {
  const [state, formAction] = useFormState<any, FormData>(action, undefined)
  const { toast } = useToast()

  useEffect(() => {
    if (state) {
      toast({
        title: state.title,
        description: state.message,
        variant: 'destructive'
      })
    }
  }, [state])

  return (
    <Form action={formAction}>
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
        <Button className="btn btn-primary w-full">{type}</Button>
      </Form.FormControl>
      {children}
    </Form>
  )
}

export default AuthForm
