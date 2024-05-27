import { sql } from '@vercel/postgres'

export const createUser = async (email: string, password: string) => {
  try {
    // Use parameterized queries to prevent SQL injection
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
