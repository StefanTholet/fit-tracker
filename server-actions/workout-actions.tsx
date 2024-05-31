'use server'

import {
  insertWorkout,
  insertExercisesAndSets,
  selectUserWorkouts,
} from '@/lib/workouts'
import {
  Workout,
  QueryResponseMessage,
  SelectUserWorkoutsInterface,
} from '@/interfaces/workout'

export const addWorkout = async (
  workout: Workout,
  userId: string
): Promise<QueryResponseMessage> => {
  try {
    const workoutId = await insertWorkout(userId, workout.name)

    await insertExercisesAndSets(workoutId, userId, workout.exercises)
    return { success: 'Workout successfully added' }
  } catch (error) {
    console.error('Error adding workout and exercises:', error)
    throw new Error('Failed to add workout and exercises.')
  }
}

export const getUserWorkouts = async (userId: string | undefined) => {
  if (!userId) {
    return []
  }
  const userWorkouts = await selectUserWorkouts(userId)
  return userWorkouts
}
