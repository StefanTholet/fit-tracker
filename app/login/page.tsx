import Link from 'next/link'
import AuthForm from '@/components/auth-forms/auth-form'
import Container from '@/components/container'
import { login } from '@/server-actions/auth-actions'
export default function Login() {
  return (
    <Container>
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg self-baseline">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <AuthForm
          action={login}
          SubmitButton={
            <button className="btn btn-primary w-full">Login</button>
          }
        />
        <p className="text-sm text-center">
          Don&apos;t have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </Container>
  )
}
