import { Exercise } from '@/interfaces/exercise'

export const isExerciseValid = (exercise: Exercise) => {
  return exercise.name && exercise.reps && exercise.sets
}
