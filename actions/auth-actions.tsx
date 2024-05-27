'use server'

import { createUser } from '@/lib/auth'
import { hashUserPassword } from '@/lib/hash'

interface SignupInterface {
  email: string
  password: string
}
export const signup = async (formData: SignupInterface) => {
  debugger
  const { email, password } = formData
  if (email && password) {
    const hashedPassword = hashUserPassword(password)
    const result = await createUser(email, hashedPassword)
    return result
  }
}
