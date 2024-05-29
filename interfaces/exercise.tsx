export interface Set {
  reps: string
  weight: string
  id: string
}
export interface Exercise {
  name: string
  sets: Set[]
  id: string
}
