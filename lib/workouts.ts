'use server'

import { QueryResultRow, sql } from '@vercel/postgres'
import { v4 as uuidv4 } from 'uuid'
import { InsertExerciseInterface, Set } from '@/interfaces/workout'
import { AddPerformedExercise } from '@/server-actions/workout-actions'

export const insertWorkoutExercises = async (
  workoutId: number,
  userId: number,
  exercises: InsertExerciseInterface[]
) => {
  return await Promise.all(
    exercises.map(async (exercise, i) => {
      await sql`
      INSERT INTO exercises (exercise_id, user_id, workout_id, name, reps, weight, exercise_order) 
      VALUES (${uuidv4()}, ${userId}, ${workoutId}, ${exercise.name}, ${
        exercise.reps
      }, ${exercise.weight}, ${i + 1})
    `
    })
  )
}

export const insertWorkout = async (
  userId: number,
  name: string
): Promise<number> => {
  const workout = await sql`
    INSERT INTO workouts (user_id, name, created_on) 
    VALUES (${userId}, ${name}, NOW()) 
    RETURNING workout_id
  `
  return workout.rows[0].workout_id
}

export const selectPlannedUserWorkouts = async (userId: number) => {
  const workoutsResponse = await sql`
  SELECT 
  workouts.workout_id as workout_id, 
  workouts.name AS workout_name,
  exercises.name AS exercise_name, 
  exercise_order,
  exercises.reps, 
  exercises.weight, 
  exercises.exercise_id, 
  ${userId} AS userId,
  workouts.created_on as created_on
FROM workouts 
INNER JOIN exercises 
ON workouts.workout_id = exercises.workout_id 
WHERE workouts.user_id = ${userId} AND exercises.performed = 0
ORDER BY exercises.exercise_order;
   `
  const userWorkouts: QueryResultRow = workoutsResponse.rows

  return userWorkouts
}

export const selectWorkout = async (workoutId: string) => {
  const workout: QueryResultRow = await sql`SELECT 
    workouts.workout_id, workouts.created_on, workouts.name AS workout_name, 
  exercises.name AS exercise_name, exercises.reps, exercises.weight, exercises.exercise_id, exercises.exercise_order
FROM workouts 
INNER JOIN exercises 
ON workouts.workout_id = exercises.workout_id 
WHERE workouts.workout_id = ${workoutId}
ORDER BY exercises.exercise_order;`

  return workout.rows
}

export const insertPerformedExercise = async ({
  userId,
  workoutId,
  exerciseId,
  performanceStatus,
  name,
  reps,
  weight
}: AddPerformedExercise) => {
  const result = await sql`INSERT INTO performed_exercises 
  ( 
  user_id,
  workout_id,
  exercise_id,
  performance_status,
  name,
  reps,
  weight
) 
VALUES(
   ${userId},
  ${workoutId},
  ${exerciseId},
  ${performanceStatus},
  ${name},
  ${reps},
  ${weight}
)`
  return result.rows
}
