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
        id: workout.exercise_id,
        order: workout.order,
        sets: []
      }
    }
    acc[workout.workout_id].exercises[workout.exercise_name].sets.push({
      reps: workout.reps,
      weight: workout.weight,
      performanceStatus: workout.performance_status
    })

    return acc
  }, {} as GroupedWorkout)

export interface ExerciseResp {
  exercise_id: string
  exercise_name: string
  reps: number
  weight: number
  order: number
  created_on: Date
  performance_status?: 'met' | 'not-met' | 'exceeded'
}

export type Set = {
  reps: number
  weight: number
  order: number
  created_on: Date
  id: string
  performanceStatus?: 'met' | 'not-met' | 'exceeded'
  [key: string]: any
}

export interface ExerciseRespGrouped extends ExerciseResp {
  sets: Set[]
}

export interface WorkoutResp {
  id: number
  name: string
  created_on: string
  exercises: ExerciseResp[]
}

export type TransformedExercises = {
  [key: string]: {
    name: string
    id: string
    order: number
    sets: Set[]
  }
}

export const groupExercises = (
  acc: TransformedExercises,
  curr: ExerciseResp
): TransformedExercises => {
  const currentExerciseName = curr.exercise_name
  const currentExercise = acc[currentExerciseName]

  if (!currentExercise) {
    acc[currentExerciseName] = {
      id: curr.exercise_id,
      name: curr.exercise_name,
      order: curr.order,
      sets: [
        {
          id: curr.exercise_id,
          reps: curr.reps,
          weight: curr.weight,
          order: curr.order,
          created_on: curr.created_on,
          performanceStatus: curr.performance_status
        }
      ]
    }
  } else {
    acc[currentExerciseName].sets.push({
      id: curr.exercise_id,
      reps: curr.reps,
      weight: curr.weight,
      order: curr.order,
      created_on: curr.created_on,
      performanceStatus: curr.performance_status
    })
  }

  return acc
}

export interface FormattedWorkout {
  id: number
  name: string
  created_on: string
  exercises: TransformedExercises
}

export const formatWorkouts = (workouts: WorkoutResp[]): FormattedWorkout[] => {
  return workouts.map((workout) => {
    const groupedExercises = workout.exercises.reduce<TransformedExercises>(
      groupExercises,
      {} as TransformedExercises
    )

    return {
      id: workout.id,
      name: workout.name,
      created_on: workout.created_on,
      exercises: groupedExercises
    }
  })
}
