import { QueryResultRow } from '@vercel/postgres'
export interface Set {
  id: string
  reps: string
  weight: string
  [key: string]: string
}

export interface Exercise {
  id: string
  name: string
  sets: Set[]
}

export interface InsertExerciseInterface {
  id: string
  name: string
  reps: string
  weight: string
}

export interface Workout {
  exercises: Exercise[]
  name: string
}

interface SuccessResponse {
  success: string
}

interface ErrorResponse {
  error: string
}

export type AddWorkoutInitialStateType = {
  exercises: Exercise[]
  workout_name: string
}

export interface SelectUserWorkoutsInterface extends QueryResultRow {
  workout_name?: string
  workout_id?: string
  created_on?: string
  exercises?: Array<{
    exercise_name?: string
    sets?: Array<{
      reps?: number
      weight?: number
    }>
  }>
}

export interface Workouts {
  workout_name: string
  workout_id: number
  created_on: string
  exercises: Exercise[]
}

export interface FlatWorkout {
  workout_id: number
  workout_name: string
  exercise_name: string
  reps: number
  weight: number
  exercise_id: string
  userid: string
  created_on: string
  exercise_order: number
  performance_status?: string
}

export interface GroupedExerciseSet {
  reps: number | string
  weight: number | string
  performanceStatus?: 'met' | 'not-met' | 'exceeded'
}
export interface GroupedExercise {
  name: string
  sets: GroupedExerciseSet[]
  [key: string]: any
}
export interface GroupedWorkout {
  name: string
  createdOn: string
  [key: string]: any
  exercises: GroupedExercise
}

export type QueryResponseMessage = SuccessResponse | ErrorResponse
