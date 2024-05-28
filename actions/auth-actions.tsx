'use server'
import {
  sessionOptions,
  SessionData,
  defaultSession,
  getUser,
  createUser,
} from '@/lib/auth'

import { hashUserPassword, verifyPassword } from '@/lib/hash'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface SignupInterface {
  email: string
  password: string
}
export const signup = async (formData: SignupInterface) => {
  try {
    const { email, password } = formData
    if (email && password) {
      const hashedPassword = hashUserPassword(password)
      const result = await createUser(email, hashedPassword)
      return result
    }
  } catch (error) {
    return error
  }
}

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  if (!session?.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn
  }

  return session
}
export const login = async (formData: SignupInterface) => {
  try {
    const { email, password } = formData

    const user = await getUser(email)
    const userPassword = user?.password
    if (!userPassword) {
      return
    }
    const isValid = verifyPassword(userPassword, password)
    if (!isValid) {
      return
    }
    const session = await getSession()

    session.isLoggedIn = true
    session.userId = user?.user_id
    session.email = email
    console.log('login', session)
    await session.save()
    return true
  } catch (error) {
    console.log(error)
  }
}
export const logout = async () => {
  const session = await getSession()
  console.log(session)

  session.destroy()
  redirect('/')
}
