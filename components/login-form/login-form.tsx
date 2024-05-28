'use client'

import { useFormState } from 'react-dom'
import { login } from '@/actions/auth-actions'

const LoginForm = () => {
  const [state, formAction] = useFormState<any, FormData>(login, undefined)

  return (
    <form className="space-y-6" action={formAction}>
      {state && state.error && (
        <p className="text-red-800 text-center">{state.error}</p>
      )}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
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
          name="password"
          type="password"
          className="input input-bordered w-full"
          placeholder="Password"
        />
      </div>
      <div className="form-control mt-6">
        <button className="btn btn-primary w-full">Login</button>
      </div>
    </form>
  )
}

export default LoginForm
