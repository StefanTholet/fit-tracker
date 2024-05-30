'use server'

import { sql } from '@vercel/postgres'
import { v4 as uuidv4 } from 'uuid'
import {
  Exercise,
  QueryResponseMessage,
  Set,
  Workout,
} from '@/interfaces/workout'

const insertExercisesAndSets = async (
  workoutId: number,
  userId: string,
  exercises: Exercise[]
) => {
  return await Promise.all(
    exercises.map(async (exercise) => {
      // Generate UUID for exercise
      const exerciseId = uuidv4()

      // Insert exercise
      await sql`
      INSERT INTO exercises (exercise_id, user_id, workout_id, name) 
      VALUES (${exerciseId}, ${userId}, ${workoutId}, ${exercise.name})
    `

      // Insert sets for exercise
      await insertSets(exerciseId, userId, exercise.sets)
    })
  )
}

const insertSets = async (exerciseId: string, userId: string, sets: Set[]) => {
  await Promise.all(
    sets.map(async (set) => {
      // Generate UUID for set
      const setId = uuidv4()

      // Insert set
      await sql`
      INSERT INTO sets (set_id, exercise_id, user_id, reps, weight) 
      VALUES (${setId}, ${exerciseId}, ${userId}, ${set.reps}, ${set.weight})
    `
    })
  )
}

const insertWorkout = async (userId: string, name: string): Promise<number> => {
  const workout = await sql`
    INSERT INTO workouts (user_id, name, created_on) 
    VALUES (${userId}, ${name}, NOW()) 
    RETURNING workout_id
  `
  return workout.rows[0].workout_id
}

export const addWorkout = async (
  workout: Workout,
  userId: string
): Promise<QueryResponseMessage> => {
  try {
    // Insert workout and get workout_id
    const workoutId = await insertWorkout(userId, workout.name)

    await insertExercisesAndSets(workoutId, userId, workout.exercises)
    return { success: 'Workout successfully added' }
  } catch (error) {
    console.error('Error adding workout and exercises:', error)
    throw new Error('Failed to add workout and exercises.')
  }
}

export const getUserWorkouts = async (userId: string) => {
  const workoutsResponse = await sql`WITH exercise_sets AS (
    SELECT
        exercises.exercise_id,
        exercises.workout_id,
        exercises.name AS exercise_name,
        json_agg(
            json_build_object(
                'reps', sets.reps,
                'weight', sets.weight
            )
        ) AS sets
    FROM
        exercises
    INNER JOIN
        sets ON exercises.exercise_id = sets.exercise_id
    GROUP BY
        exercises.exercise_id
),
workout_exercises AS (
    SELECT
        workouts.workout_id,
        workouts.name AS workout_name,
        workouts.created_on,
        json_agg(
            json_build_object(
                'id', exercise_sets.exercise_id,
                'name', exercise_sets.exercise_name,
                'sets', exercise_sets.sets
            )
        ) AS exercises
    FROM
        workouts
    INNER JOIN
        exercise_sets ON workouts.workout_id = exercise_sets.workout_id
    GROUP BY
        workouts.workout_id
)
SELECT
    workout_name,
    workout_id,
    created_on,
    exercises
FROM
    workout_exercises
WHERE
    workout_exercises.workout_id IN (
        SELECT workout_id
        FROM workouts
        WHERE user_id = ${userId}
    )`
  const userWorkouts = workoutsResponse.rows

  return userWorkouts
}
