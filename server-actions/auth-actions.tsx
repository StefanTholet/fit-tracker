'use server'
import {
  sessionOptions,
  SessionData,
  defaultSession,
  getUser,
  createUser
} from '@/lib/auth'

import { hashUserPassword, verifyPassword } from '@/lib/hash'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface User {
  email: string
  user_id: number
}

const updateSession = async (user: User) => {
  const session = await getSession()
  session.email = user?.email
  session.isLoggedIn = true
  session.userId = user?.user_id
  await session.save()
  return session
}

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  if (!session?.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn
  }

  return session
}

export const signup = async (
  prevState: any,
  formData: FormData
): Promise<{
  message: string
  variant: 'success' | 'danger' | 'warning'
  title: string
}> => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return {
      message: 'All fields are required',
      title: 'Registration unsuccessful',
      variant: 'danger'
    }
  }

  const hashedPassword = hashUserPassword(password)
  const user = await createUser(email, hashedPassword)

  if (!user) {
    return {
      title: 'Registration unsuccessful',
      message:
        'Registration unsuccessful. Please try again using different credentials.',
      variant: 'danger'
    }
  }

  await updateSession(user as User)
  redirect('/add-workouts')
}

export const login = async (
  prevState: any,
  formData: FormData
): Promise<{
  message: string
  variant: 'success' | 'danger' | 'warning'
  title: string
}> => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const message = {
    message: 'All fields are required',
    variant: 'danger' as 'danger',
    title: 'Unsuccessful login'
  }

  if (!email || !password) {
    return { ...message, message: 'All fields are required' }
  }

  const user = await getUser(email)
  if (!user) {
    return { ...message, message: 'Wrong credentials' }
  }

  const userPassword = user.password
  const isValid = verifyPassword(userPassword, password)
  if (!isValid) {
    return { ...message, message: 'Wrong credentials' }
  }

  await updateSession(user as User)

  redirect('/dashboard')
}

export const logout = async () => {
  const session = await getSession()
  session.destroy()
  redirect('/')
}
