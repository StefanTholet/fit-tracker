import { sql } from '@vercel/postgres'

export const getWorkouts = async () => {
  try {
    const workouts = await sql`select * from workout`
    return workouts.rows
  } catch (error) {
    console.log(error)
  }
}
