'use server'

import { QueryResultRow, sql } from '@vercel/postgres'
import { v4 as uuidv4 } from 'uuid'
import { InsertExerciseInterface, Set } from '@/interfaces/workout'

export const insertWorkoutExercises = async (
  workoutId: number,
  userId: string,
  exercises: InsertExerciseInterface[]
) => {
  return await Promise.all(
    exercises.map(async (exercise) => {
      await sql`
      INSERT INTO exercises (exercise_id, user_id, workout_id, name, reps, weight) 
      VALUES (${uuidv4()}, ${userId}, ${workoutId}, ${exercise.name}, ${
        exercise.reps
      }, ${exercise.weight})
    `
    })
  )
}

export const insertWorkout = async (
  userId: string,
  name: string
): Promise<number> => {
  const workout = await sql`
    INSERT INTO workouts (user_id, name, created_on) 
    VALUES (${userId}, ${name}, NOW()) 
    RETURNING workout_id
  `
  return workout.rows[0].workout_id
}

export const selectPlannedUserWorkouts = async (userId: string) => {
  const workoutsResponse = await sql`
  SELECT 
  workouts.workout_id, workouts.name AS workout_name,
  exercises.name AS exercise_name, exercises.reps, 
  exercises.weight, exercises.exercise_id, ${userId} AS userId,
  workouts.created_on as created_on
   from workouts 
  INNER JOIN exercises 
  ON workouts.workout_id = exercises.workout_id 
  WHERE workouts.user_id = ${userId} AND exercises.performed = 0
   `
  const userWorkouts: QueryResultRow = workoutsResponse.rows

  return userWorkouts
}
