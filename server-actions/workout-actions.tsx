'use server'

import {
  insertPerformedExercise,
  insertWorkout,
  insertWorkoutExercises,
  selectLastPerformedWorkoutById,
  selectPlannedUserWorkouts,
  selectWorkout
} from '@/lib/workouts'
import { Workout, QueryResponseMessage, Exercise } from '@/interfaces/workout'
import { flattenExercises } from '@/utils/exercise'

export const addWorkout = async (
  workout: Workout,
  userId: number
): Promise<QueryResponseMessage> => {
  try {
    const workoutId = await insertWorkout(userId, workout.name)
    const flattenedExercises = flattenExercises(workout.exercises)

    await insertWorkoutExercises(workoutId, userId, flattenedExercises)
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
  userId: number
  workoutId: number
  exerciseId: string
  performanceStatus: string
  name: string
  reps: string
  weight: string
  order: string
}

export const addPerformedExercise = async ({
  userId,
  workoutId,
  exerciseId,
  performanceStatus,
  name,
  reps,
  weight,
  order
}: AddPerformedExercise) => {
  const result = await insertPerformedExercise({
    userId,
    workoutId,
    exerciseId,
    performanceStatus,
    name,
    reps,
    weight,
    order
  })
  return result
}

export const getLastPerformedWorkoutById = async (workout_id: number) => {
  const result = await selectLastPerformedWorkoutById(workout_id)
  return result
}
