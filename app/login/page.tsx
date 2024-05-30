import Link from 'next/link'
import LoginForm from '@/components/auth-forms/login-form/login-form'
import Container from '@/components/container'
export default function Login() {
  return (
    <Container>
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg self-baseline">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <LoginForm />
        <p className="text-sm text-center">
          Don&apos;t have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </Container>
  )
}
