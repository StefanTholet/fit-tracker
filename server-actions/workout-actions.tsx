'use server'

import {
  insertManyPerformedExercises,
  insertPerformedExercise,
  insertWorkout,
  insertWorkoutExercises,
  selectLastPerformedWorkoutById,
  selectPlannedUserWorkouts,
  selectWorkout
} from '@/lib/workouts'
import { Workout, QueryResponseMessage } from '@/interfaces/workout'
import { flattenExercises } from '@/utils/exercise'

export const addWorkoutName = async (
  userId: string | number,
  workoutName: string,
  type: 'planned' | 'freestyle'
) => {
  const workoutId = await insertWorkout(userId, workoutName, type)
  return workoutId
}

export const addWorkout = async (
  workout: Workout,
  userId: number | string,
  type: 'planned' | 'freestyle'
): Promise<QueryResponseMessage> => {
  try {
    const workoutId = await insertWorkout(userId, workout.name, type)
    const flattenedExercises = flattenExercises(workout.exercises)

    await insertWorkoutExercises(workoutId, userId, flattenedExercises)
    return { success: 'Workout successfully added' }
  } catch (error) {
    console.error('Error adding workout and exercises:', error)
    throw new Error('Failed to add workout and exercises.')
  }
}

export const addFreestyleWorkout = async (
  workout: Workout,
  userId: number | string
): Promise<QueryResponseMessage> => {
  try {
    const workoutId = await insertWorkout(userId, workout.name, 'freestyle')
    const flattenedExercises = flattenExercises(workout.exercises)
    console.log(flattenedExercises)
    const insertedPlannedExercises = await insertWorkoutExercises(
      workoutId,
      userId,
      flattenedExercises
    )
    if (
      insertedPlannedExercises &&
      Array.isArray(insertedPlannedExercises) &&
      insertedPlannedExercises.length > 0
    ) {
      await insertManyPerformedExercises(insertedPlannedExercises)
    }

    return { success: 'Workout successfully added' }
  } catch (error) {
    console.error('Error adding workout and exercises:', error)
    throw new Error('Failed to add workout and exercises.')
  }
}

export const getUserWorkouts = async (userId: number | undefined) => {
  if (!userId) {
    return
  }
  const userWorkouts = await selectPlannedUserWorkouts(userId)

  return userWorkouts
}

export const getWorkout = async (workoutId: string) => {
  const workout = await selectWorkout(workoutId)
  return workout
}

export interface AddPerformedExercise {
  userId: number | string
  workoutId: number | string
  exerciseId: string | string
  performanceStatus: string | undefined
  name: string
  reps: string
  weight: string
  exercise_order: number
}

export const addPerformedExercise = async ({
  userId,
  workoutId,
  exerciseId,
  performanceStatus,
  name,
  reps,
  weight,
  exercise_order
}: AddPerformedExercise) => {
  const result = await insertPerformedExercise({
    userId,
    workoutId,
    exerciseId,
    performanceStatus,
    name,
    reps,
    weight,
    exercise_order
  })
  return result
}

export const getLastPerformedWorkoutById = async (workout_id: number) => {
  const result = await selectLastPerformedWorkoutById(workout_id)
  return result
}
