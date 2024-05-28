'use client'
import React, { MouseEvent, useEffect } from 'react'
import useForm from '@/hooks/useForm'
import { login } from '@/actions/auth-actions'
import { redirect } from 'next/navigation'

interface FormData {
  email: string
  password: string
}

const initialData: FormData = { password: '', email: '' }

const LoginForm = () => {
  const { handleChange, formData, isSubmitted, setIsSubmitted } =
    useForm(initialData)

  const onSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const result = await login(formData as FormData)

    if (result) {
      setIsSubmitted(true)
    }
  }

  useEffect(() => {
    if (isSubmitted) {
      redirect('/dashboard')
    }
  }, [isSubmitted])

  return (
    <form className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          onChange={handleChange}
          name="email"
          type="email"
          className="input input-bordered w-full"
          placeholder="Email"
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          onChange={handleChange}
          name="password"
          type="password"
          className="input input-bordered w-full"
          placeholder="Password"
        />
      </div>
      <div className="form-control mt-6">
        <button onClick={onSubmit} className="btn btn-primary w-full">
          Login
        </button>
      </div>
    </form>
  )
}

export default LoginForm
