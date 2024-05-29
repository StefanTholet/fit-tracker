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

export type QueryResponseMessage = SuccessResponse | ErrorResponse
