'use server'

import { QueryResultRow, sql } from '@vercel/postgres'
import { v4 as uuidv4 } from 'uuid'
import { InsertExerciseInterface } from '@/interfaces/workout'
import { PerformedExercise } from '@/server-actions/workout-actions'
import { Set, WorkoutResp } from '@/utils/exercise'

export const insertWorkout = async (
  userId: number | string,
  name: string,
  type: 'planned' | 'freestyle'
): Promise<number> => {
  const workout = await sql`
    INSERT INTO workouts (user_id, name, created_on, type) 
    VALUES (${userId}, ${name}, NOW(), ${type}) 
    RETURNING id
  `
  return workout.rows[0].id
}

export const selectWorkout = async (workoutId: string) => {
  const workout: QueryResultRow = await sql`SELECT 
  workouts.id,
  workouts.name,
  workouts.created_on,
  json_agg(
    json_build_object(
      'exercise_id', exercises.exercise_id,
      'exercise_name', exercises.name,
      'reps', exercises.reps,
      'weight', exercises.weight,
      'order', exercises.exercise_order,
      'created_on', exercises.created_on
    ) ORDER BY exercises.exercise_order
  ) AS exercises
FROM 
  workouts
JOIN 
  exercises ON workouts.id = exercises.workout_id
WHERE workouts.id = ${workoutId}
GROUP BY 
  workouts.id, workouts.name, workouts.created_on
`

  return workout.rows
}

export interface InsertPerformedExercise extends PerformedExercise {
  userId: string | number
  workoutId: string | number
  exerciseId: string
}
export const insertPerformedExercise = async ({
  id,
  userId,
  workoutId,
  exerciseId,
  performanceStatus,
  name,
  reps,
  weight,
  order
}: InsertPerformedExercise) => {
  const result = await sql`INSERT INTO performed_exercises 
  ( 
  user_id,
  id,
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
   ${id},
  ${workoutId},
  ${exerciseId},
  ${performanceStatus},
  ${name},
  ${reps},
  ${weight},
  ${order}
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
  order: number
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
      }, ${'met'}, ${exercise.order})`
    })
  )
}

export const selectLastPerformedWorkoutById = async (workout_id: number) => {
  const result: QueryResultRow = await sql`
    SELECT
    workouts.id,
    workouts.name,
    workouts.created_on,
    json_agg(
      json_build_object(
      'exercise_id', performed_exercises.id,
      'exercise_name', performed_exercises.name,
      'reps', performed_exercises.reps,
      'weight', performed_exercises.weight,
        'created_on', performed_exercises.created_on,
        'performance_status', performed_exercises.performance_status,
        'order', performed_exercises.exercise_order
      ) ORDER BY performed_exercises.exercise_order
         ) as exercises
          FROM 
            workouts
            JOIN
            performed_exercises 
            ON 
            workouts.id = performed_exercises.workout_id
            WHERE workouts.id = ${workout_id}
            GROUP BY workouts.id, workouts.name, workouts.created_on
            ORDER BY 
  workouts.created_on DESC
LIMIT 1
  `

  return result.rows as WorkoutResp[]
}

export const selectLastPerformedWorkout = async (userId: number | string) => {
  const { rows } = await sql`SELECT 
  workouts.id,
  workouts.name,
  workouts.created_on,
  json_agg(
    json_build_object(
      'exercise_id', performed_exercises.id,
      'exercise_name', performed_exercises.name,
      'reps', performed_exercises.reps,
      'weight', performed_exercises.weight,
      'order', performed_exercises.exercise_order,
      'created_on', performed_exercises.created_on,
      'performance_status', performed_exercises.performance_status
    ) ORDER BY performed_exercises.exercise_order
  ) AS exercises
FROM 
  workouts
JOIN 
  performed_exercises ON workouts.id = performed_exercises.workout_id
WHERE workouts.user_id = ${userId}
GROUP BY 
  workouts.id, workouts.name, workouts.created_on, performed_exercises.created_on
ORDER BY 
  performed_exercises.created_on DESC
LIMIT 1
`

  return rows[0] as WorkoutResp
}

export const selectPlannedUserWorkouts = async (userId: number | string) => {
  const workoutsResponse = await sql`
  SELECT 
  workouts.id, 
  workouts.name,
  workouts.created_on,
  json_agg(
    json_build_object(
      'exercise_id', exercises.exercise_id,
      'exercise_name', exercises.name,
      'reps', exercises.reps,
      'weight', exercises.weight,
      'order', exercises.exercise_order,
      'created_on', exercises.created_on 
    ) ORDER BY exercises.exercise_order
  ) AS exercises
  FROM 
  workouts
  JOIN 
    exercises 
    ON 
    workouts.id = exercises.workout_id
    WHERE
    workouts.user_id = ${userId}
    GROUP BY
      workouts.id, workouts.name, workouts.created_on
      ORDER BY 
      workouts.created_on DESC
   `
  const userWorkouts = workoutsResponse.rows
  return userWorkouts as WorkoutResp[]
}

export const selectPerformedExercisePerformanceDates = async (
  exerciseId: number | string,
  order: number,
  reps: string | number,
  weight: string | number
) => {
  //TODO - change insertPerformedExercise to attach its own ID instead of adding it automatically so that it can be used to make this request reliant
  const result = await sql`SELECT created_on FROM performed_exercises 
    WHERE exercise_id = ${exerciseId} AND exercise_order = ${order} AND reps = ${reps} AND weight = ${weight}
    ORDER BY created_on DESC
    LIMIT 1
`
  return result.rows[0]?.created_on
}

export const updatePerformedSet = async ({
  id,
  performanceStatus,
  reps,
  weight,
  order
}: {
  id: string
  performanceStatus: 'met' | 'not-met' | 'exceeded'
  reps: string | number
  weight: string | number
  order: string | number
}) => {
  const result = await sql` UPDATE performed_exercises 
SET  
  performance_status = ${performanceStatus},
  reps=${reps},
  weight=${weight},
  exercise_order=${order},
  created_on = CURRENT_TIMESTAMP
WHERE id = ${id} AND DATE(created_on) = CURRENT_DATE
RETURNING created_on,
exercise_id AS id,
exercise_order AS order,
performance_status,
id AS performed_exercise_id,
reps,
weight

`
  return result.rows[0]
}

export const selectPerformedExercise = async (id: string) => {
  const result =
    await sql`SELECT * FROM performed_exercises WHERE performed_exercises.id = ${id}`
  return result.rows[0]
}

export const insertExercise = async (
  workoutId: string | number,
  userId: string | number,
  name: string,
  weight: string | number,
  reps: string | number,
  order: number
) => {
  const { rows } =
    await sql`INSERT INTO exercises (exercise_id, user_id, workout_id, name, reps, weight, exercise_order) 
        VALUES (${uuidv4()}, ${userId}, ${workoutId}, ${name}, ${reps}, ${weight}, ${order})
        RETURNING created_on, exercise_id AS id, exercise_order as order, reps, weight, name`
  return rows[0] as Set
}

export const updateSet = async (
  exerciseId: string | number,
  reps: number | string,
  weight: number | string,
  order: number
) => {
  const { rows } = await sql`
    UPDATE exercises
      SET reps=${reps}, weight=${weight}, exercise_order=${order}
      WHERE exercise_id=${exerciseId}
      RETURNING *
    `
  return rows[0]
}
//TODO FIX FOREIGN KEY PROBLEM
export const deletePlannedSet = async (id: string) => {
  const { rows } =
    await sql`DELETE FROM exercises WHERE exercises.exercise_id=${id} RETURNING *`

  return rows[0]
}

export const deletePerformedSet = async (id: string) => {
  const { rows } =
    await sql`DELETE FROM performed_exercises WHERE performed_exercises.id=${id} RETURNING *`

  return rows[0]
}
