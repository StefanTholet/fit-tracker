'use client'
import { ChangeEvent, MouseEvent, useState } from 'react'
import Link from 'next/link'
import { signup } from '@/actions/auth-actions'

export default function Signup() {
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e
    const { name, value } = target
    setFormData((data) => ({ ...data, [name]: value }))
  }
  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      signup(formData)
    } catch (error) {}
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
        <h1 className="text-2xl font-bold text-center">Register</h1>
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
            <button onClick={handleSubmit} className="btn btn-primary w-full">
              Register
            </button>
          </div>
        </form>
        <p className="text-sm text-center">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
