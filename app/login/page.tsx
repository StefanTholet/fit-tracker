import Link from 'next/link'
import LoginForm from '@/components/login-form/login-form'
export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <LoginForm />
        <p className="text-sm text-center">
          Don&apos;t have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}
