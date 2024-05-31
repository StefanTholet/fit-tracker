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

// type GetWorkoutSets = {
//   reps: number
//   weight: number
// }

// type GetWorkoutExercise = {
//   id: string
//   name: string
//   sets: GetWorkoutSets[]
// }

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

interface WorkoutTableProps {
  workouts: Workouts[]
}

// export interface GetWorkoutsResponseInterface {
//   workout_name: string
//   workout_id: number
//   created_on: string
//   exercises: Exercise[]
// }

export type QueryResponseMessage = SuccessResponse | ErrorResponse
