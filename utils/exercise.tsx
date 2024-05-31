import { Exercise, InsertExerciseInterface } from '../interfaces/workout'

export const isExerciseValid = (exercise: Exercise) => {
  return exercise.name && exercise.sets[0].weight && exercise.sets[0].reps
}

export const flattenExercises = (
  exercises: Exercise[]
): InsertExerciseInterface[] =>
  exercises.reduce((array, exercise) => {
    const exerciseSets = exercise.sets.map((set) => ({
      name: exercise.name,
      ...set,
    }))
    return array.concat(exerciseSets)
  }, [] as InsertExerciseInterface[])
