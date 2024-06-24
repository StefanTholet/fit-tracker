'use server'

import {
  insertExercise,
  insertManyPerformedExercises,
  insertPerformedExercise,
  insertWorkout,
  insertWorkoutExercises,
  selectLastPerformedWorkout,
  selectLastPerformedWorkoutById,
  selectPerformedExercise,
  selectPlannedUserWorkouts,
  selectWorkout,
  updatePerformedExercise,
  updatePlannedSet as updateSet,
  deletePlannedSet as deleteSet,
} from '@/lib/workouts'
import { Workout, QueryResponseMessage } from '@/interfaces/workout'
import { WorkoutResp, flattenExercises } from '@/utils/exercise'

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

export const addExercise = async (
  workoutId: string | number,
  userId: string | number,
  name: string,
  weight: string | number,
  reps: string | number,
  order: number
) => {
  try {
    const newExercise = await insertExercise(
      workoutId,
      userId,
      name,
      weight,
      reps,
      order
    )
    return newExercise
  } catch (error) {}
}

export const addFreestyleWorkout = async (
  workout: Workout,
  userId: number | string
): Promise<QueryResponseMessage> => {
  try {
    const workoutId = await insertWorkout(userId, workout.name, 'freestyle')
    const flattenedExercises = flattenExercises(workout.exercises)

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

export const getUserWorkouts = async (
  userId: number | string
): Promise<WorkoutResp[]> => {
  const userWorkouts = await selectPlannedUserWorkouts(userId)
  return userWorkouts
}

export const getWorkout = async (workoutId: string) => {
  const workout = await selectWorkout(workoutId)
  return workout
}

interface DashboardDataInterface {
  userWorkouts: WorkoutResp[]
  lastPerformedWorkout: WorkoutResp
}

export const getDashboardData = async (
  userId: string | number
): Promise<DashboardDataInterface> => {
  const userWorkouts = await getUserWorkouts(userId)
  const lastPerformedWorkout = await selectLastPerformedWorkout(userId)

  return { userWorkouts, lastPerformedWorkout } as DashboardDataInterface
}

export interface AddPerformedExercise {
  id: string
  userId: number | string
  workoutId: number | string
  exerciseId: string | number
  performanceStatus: 'met' | 'not-met' | 'exceeded'
  name: string
  reps: string | number
  weight: string | number
  order: number
}

export const addPerformedExercise = async ({
  id,
  userId,
  workoutId,
  exerciseId,
  performanceStatus,
  name,
  reps,
  weight,
  order,
}: AddPerformedExercise) => {
  const isPerformed = await selectPerformedExercise(id)
  if (!isPerformed) {
    await insertPerformedExercise({
      id,
      userId,
      workoutId,
      exerciseId,
      performanceStatus,
      name,
      reps,
      weight,
      order,
    })
    return 'edited'
  }

  await updatePerformedExercise({
    exerciseId,
    performanceStatus,
    reps,
    weight,
    order,
  })
  return 'completed'
}

export const getLastPerformedWorkoutById = async (workout_id: number) => {
  const result = await selectLastPerformedWorkoutById(workout_id)
  return result
}

export const updatePlannedSet = async (
  exerciseId: string | number,
  reps: number | string,
  weight: number | string,
  order: number
) => {
  try {
    const result = await updateSet(exerciseId, reps, weight, order)
    return result
  } catch (error) {
    return error
  }
}

export const deletePlannedSet = async (id: string) => {
  try {
    const result = await deleteSet(id)
    return result
  } catch (error) {
    console.log(error)

    return error
  }
}
