'use server'

import { sql } from '@vercel/postgres'
import { v4 as uuidv4 } from 'uuid'
import { Exercise, Set, Workout } from '@/interfaces/workout'

const insertExercisesAndSets = async (
  workoutId: number,
  exercises: Exercise[]
) => {
  return await Promise.all(
    exercises.map(async (exercise) => {
      // Generate UUID for exercise
      const exerciseId = uuidv4()

      // Insert exercise
      await sql`
      INSERT INTO exercises (exercise_id, workout_id, name) 
      VALUES (${exerciseId}, ${workoutId}, ${exercise.name})
    `

      // Insert sets for exercise
      await insertSets(exerciseId, exercise.sets)
    })
  )
}

const insertSets = async (exerciseId: string, sets: Set[]) => {
  await Promise.all(
    sets.map(async (set) => {
      // Generate UUID for set
      const setId = uuidv4()

      // Insert set
      await sql`
      INSERT INTO sets (set_id, exercise_id, reps, weight) 
      VALUES (${setId}, ${exerciseId}, ${set.reps}, ${set.weight})
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
  console.log(workout)

  return workout.rows[0].workout_id
}

export const addWorkout = async (
  workout: Workout,
  userId: string
): Promise<void> => {
  try {
    // Insert workout and get workout_id
    const workoutId = await insertWorkout(userId, workout.name)
    // // Insert exercises and sets
    await insertExercisesAndSets(workoutId, workout.exercises)
    console.log('Workout and exercises added successfully.')
  } catch (error) {
    console.error('Error adding workout and exercises:', error)
    throw new Error('Failed to add workout and exercises.')
  }
}

export const getUserWorkouts = async (userId: string) => {
  const workoutsResponse =
    await sql`SELECT * FROM workouts WHERE user_id = ${userId}`
  const userWorkouts = workoutsResponse.rows
  // get all exercises related to all workouts and then all sets related to the exercises
  return userWorkouts
}
