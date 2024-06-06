import Link from 'next/link'
import Container from '@/components/container'
import AuthForm from '@/components/auth-forms/auth-form'
import { signup } from '@/server-actions/auth-actions'
import { Button } from '@/components/ui/button'
export default function Signup() {
  return (
    <Container>
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg self-baseline">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <AuthForm
          action={signup}
          SubmitButton={
            <Button className="btn btn-primary w-full">Register</Button>
          }
        />
        <p className="text-sm text-center">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </Container>
  )
}
