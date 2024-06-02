import { Exercise, InsertExerciseInterface } from '../interfaces/workout'
import { FlatWorkout, GroupedWorkout } from '@/interfaces/workout'

export const isExerciseValid = (exercise: Exercise) => {
  return exercise.name && exercise.sets[0].weight && exercise.sets[0].reps
}

export const flattenExercises = (
  exercises: Exercise[]
): InsertExerciseInterface[] =>
  exercises.reduce((array, exercise) => {
    const exerciseSets = exercise.sets.map((set) => ({
      name: exercise.name,
      ...set
    }))
    return array.concat(exerciseSets)
  }, [] as InsertExerciseInterface[])

export const groupWorkouts = (workouts: FlatWorkout[]) =>
  workouts.reduce((acc: GroupedWorkout, workout: FlatWorkout) => {
    if (!acc[workout.workout_id]) {
      acc[workout.workout_id] = {
        workoutId: workout.workout_id,
        name: workout.workout_name,
        createdOn: workout.created_on,
        exercises: {}
      }
    }

    if (!acc[workout.workout_id].exercises[workout.exercise_name]) {
      acc[workout.workout_id].exercises[workout.exercise_name] = {
        name: workout.exercise_name,
        exercise_id: workout.exercise_id,
        sets: []
      }
    }
    acc[workout.workout_id].exercises[workout.exercise_name].sets.push({
      reps: workout.reps,
      weight: workout.weight
    })

    return acc
  }, {} as GroupedWorkout)
