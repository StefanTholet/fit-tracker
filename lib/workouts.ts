'use server'

import { QueryResultRow, sql } from '@vercel/postgres'
import { v4 as uuidv4 } from 'uuid'
import { FlatWorkout, InsertExerciseInterface } from '@/interfaces/workout'
import { AddPerformedExercise } from '@/server-actions/workout-actions'
import { WorkoutResp } from '@/utils/exercise'

export const insertWorkout = async (
  userId: number | string,
  name: string,
  type: 'planned' | 'freestyle'
): Promise<number> => {
  const workout = await sql`
    INSERT INTO workouts (user_id, name, created_on, type) 
    VALUES (${userId}, ${name}, NOW(), ${type}) 
    RETURNING workout_id
  `
  return workout.rows[0].workout_id
}

export const selectWorkout = async (workoutId: string) => {
  const workout: QueryResultRow = await sql`SELECT 
  workouts.workout_id,
  workouts.name,
  workouts.created_on,
  json_agg(
    json_build_object(
      'exercise_id', exercises.exercise_id,
      'exercise_name', exercises.name,
      'reps', exercises.reps,
      'weight', exercises.weight,
      'exercise_order', exercises.exercise_order,
      'created_on', exercises.created_on
    ) ORDER BY exercises.exercise_order
  ) AS exercises
FROM 
  workouts
JOIN 
  exercises ON workouts.workout_id = exercises.workout_id
WHERE workouts.workout_id = ${workoutId}
GROUP BY 
  workouts.workout_id, workouts.name, workouts.created_on
`

  return workout.rows
}

export const insertPerformedExercise = async ({
  userId,
  workoutId,
  exerciseId,
  performanceStatus,
  name,
  reps,
  weight,
  exercise_order
}: AddPerformedExercise) => {
  const result = await sql`INSERT INTO performed_exercises 
  ( 
  user_id,
  workout_id,
  exercise_id,
  performance_status,
  name,
  reps,
  weight,
  exercise_order
) 
VALUES(
   ${userId},
  ${workoutId},
  ${exerciseId},
  ${performanceStatus},
  ${name},
  ${reps},
  ${weight},
  ${exercise_order}
)`

  return result.rows
}

interface InsertWorkoutExercisesResponse {
  exercise_id: string
  workout_id: number
  user_id: number
  name: string
  weight: number
  reps: number
  created_on: string
  exercise_order: number
}

export const insertWorkoutExercises = async (
  workoutId: number,
  userId: number | string,
  exercises: InsertExerciseInterface[]
) => {
  const result = await Promise.all(
    exercises.map(async (exercise, i) => {
      const res = await sql`
        INSERT INTO exercises (exercise_id, user_id, workout_id, name, reps, weight, exercise_order) 
        VALUES (${uuidv4()}, ${userId}, ${workoutId}, ${exercise.name}, ${
        exercise.reps
      }, ${exercise.weight}, ${i + 1})
        RETURNING *
      `
      return <InsertWorkoutExercisesResponse>res.rows[0]
    })
  )

  return result
}

export const insertManyPerformedExercises = async (
  performedExercises: InsertWorkoutExercisesResponse[]
) => {
  return await Promise.all(
    performedExercises.map(async (exercise, i) => {
      return await sql`INSERT INTO performed_exercises 
                              (exercise_id, user_id, workout_id, name, reps, weight, performance_status, exercise_order)
                              VALUES(${exercise.exercise_id}, ${
        exercise.user_id
      }, ${exercise.workout_id}, 
                              ${exercise.name}, ${exercise.reps}, ${
        exercise.weight
      }, ${'met'}, ${exercise.exercise_order})`
    })
  )
}

export const selectLastPerformedWorkoutById = async (workout_id: number) => {
  console.log(workout_id)

  const result: QueryResultRow = await sql`
    SELECT
    workouts.workout_id,
    workouts.name,
    workouts.created_on,
    json_agg(
      json_build_object(
      'exercise_id', performed_exercises.performed_exercise_id,
      'exercise_name', performed_exercises.name,
      'reps', performed_exercises.reps,
      'weight', performed_exercises.weight,
        'created_on', performed_exercises.created_on,
        'performance_status', performed_exercises.performance_status,
        'exercise_order', performed_exercises.exercise_order
      ) ORDER BY performed_exercises.exercise_order
         ) as exercises
          FROM 
            workouts
            JOIN
            performed_exercises 
            ON 
            workouts.workout_id = performed_exercises.workout_id
            WHERE workouts.workout_id = ${workout_id}
            GROUP BY workouts.workout_id, workouts.name, workouts.created_on
            ORDER BY 
  workouts.created_on DESC
LIMIT 1
  `

  return result.rows as WorkoutResp[]
}

export const selectLastPerformedWorkout = async (userId: number | string) => {
  const { rows } = await sql`SELECT 
  workouts.workout_id,
  workouts.name,
  workouts.created_on,
  json_agg(
    json_build_object(
      'exercise_id', performed_exercises.performed_exercise_id,
      'exercise_name', performed_exercises.name,
      'reps', performed_exercises.reps,
      'weight', performed_exercises.weight,
      'exercise_order', performed_exercises.exercise_order,
      'created_on', performed_exercises.created_on,
      'performance_status', performed_exercises.performance_status
    ) ORDER BY performed_exercises.exercise_order
  ) AS exercises
FROM 
  workouts
JOIN 
  performed_exercises ON workouts.workout_id = performed_exercises.workout_id
WHERE workouts.user_id = ${userId}
GROUP BY 
  workouts.workout_id, workouts.name, workouts.created_on, performed_exercises.created_on
ORDER BY 
  performed_exercises.created_on DESC
LIMIT 1
`
  return rows[0] as WorkoutResp
}

export const selectPlannedUserWorkouts = async (userId: number | string) => {
  const workoutsResponse = await sql`
  SELECT 
  workouts.workout_id, 
  workouts.name,
  workouts.created_on,
  json_agg(
    json_build_object(
      'exercise_id', exercises.exercise_id,
      'exercise_name', exercises.name,
      'reps', exercises.reps,
      'weight', exercises.weight,
      'exercise_order', exercises.exercise_order,
      'created_on', exercises.created_on 
    ) ORDER BY exercises.exercise_order
  ) AS exercises
  FROM 
  workouts
  JOIN 
    exercises 
    ON 
    workouts.workout_id = exercises.workout_id
    WHERE
    workouts.user_id = ${userId}
    GROUP BY
      workouts.workout_id, workouts.name, workouts.created_on
      ORDER BY 
      workouts.created_on DESC
   `
  const userWorkouts = workoutsResponse.rows
  return userWorkouts as WorkoutResp[]
}
