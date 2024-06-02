'use server'

import {
  insertPerformedExercise,
  insertWorkout,
  insertWorkoutExercises,
  selectPlannedUserWorkouts,
  selectWorkout
} from '@/lib/workouts'
import { Workout, QueryResponseMessage, Exercise } from '@/interfaces/workout'
import { flattenExercises } from '@/utils/exercise'

export const addWorkout = async (
  workout: Workout,
  userId: string
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

export const getUserWorkouts = async (userId: string | undefined) => {
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
}

export const addPerformedExercise = async ({
  userId,
  workoutId,
  exerciseId,
  performanceStatus,
  name,
  reps,
  weight
}: AddPerformedExercise) => {
  const result = await insertPerformedExercise({
    userId,
    workoutId,
    exerciseId,
    performanceStatus,
    name,
    reps,
    weight
  })
  return result
}
