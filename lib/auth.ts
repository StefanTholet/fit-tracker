import { sql } from '@vercel/postgres'
import { SessionOptions } from 'iron-session'

export interface AuthData {
  email: string
  password: string
}

export interface SessionData {
  userId?: number
  email?: string
  isLoggedIn: boolean
}

const SECRET_KEY = process.env.SECRET_KEY

if (!SECRET_KEY) {
  throw new Error('Missing environment variable: SECRET_KEY')
}

export const sessionOptions: SessionOptions = {
  password: SECRET_KEY,
  cookieName: 'user-session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}

export const defaultSession: SessionData = {
  isLoggedIn: false
}

export const createUser = async (email: string, password: string) => {
  try {
    const result = await sql`
      INSERT INTO users (email, password)
      VALUES (${email}, ${password})
      RETURNING *
    `

    return result.rows[0] // Return the inserted user
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Error creating user')
  }
}

export const getUser = async (email: string) => {
  const result = await sql`
    SELECT email, password, user_id FROM users WHERE email = ${email}`

  return result.rows[0]
}
