import { Exercise } from '@/interfaces/exercise'

export const isExerciseValid = (exercise: Exercise) => {
  return exercise.name && exercise.sets[0].weight && exercise.sets[0].reps
}
