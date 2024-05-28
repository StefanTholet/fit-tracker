'use client'
import { useFormState } from 'react-dom'
import Link from 'next/link'
import Container from '@/components/container'
import { signup } from '@/actions/auth-actions'

export default function Signup() {
  // const [formData, setFormData] = useState({ email: '', password: '' })

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { target } = e
  //   const { name, value } = target
  //   setFormData((data) => ({ ...data, [name]: value }))
  // }
  // const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault()
  //   try {
  //     signup(formData)
  //   } catch (error) {}
  // }
  const [state, formAction] = useFormState<any, FormData>(signup, undefined)
  return (
    <Container>
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg self-baseline">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <form className="space-y-6" action={formAction}>
          {state?.error && (
            <p className="text-red-800 text-center">{state.error}</p>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              // onChange={handleChange}
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
              // onChange={handleChange}
              name="password"
              type="password"
              className="input input-bordered w-full"
              placeholder="Password"
            />
          </div>
          <div className="form-control mt-6">
            <button
              // onClick={handleSubmit}
              className="btn btn-primary w-full"
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-sm text-center">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </Container>
  )
}
