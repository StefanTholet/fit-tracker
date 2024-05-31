'use server'

import {
  insertWorkout,
  insertWorkoutExercises,
  selectPlannedUserWorkouts,
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
    return []
  }
  const userWorkouts = await selectPlannedUserWorkouts(userId)
  //TODO reverse data structure to look like Exercises interface and return it
  console.log(userWorkouts)

  // return userWorkouts
}
