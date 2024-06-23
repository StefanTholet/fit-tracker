// Import statements
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
        exercise_order: workout.exercise_order,
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

// Interfaces
export interface ExerciseResp {
  exercise_id: string
  exercise_name: string
  reps: number
  weight: number
  exercise_order: number
  created_on: Date
  performance_status?: 'met' | 'not-met' | 'exceeded'
}

export type Set = {
  reps: number
  weight: number
  exercise_order: number
  created_on: Date
  exercise_id: string
  performanceStatus?: 'met' | 'not-met' | 'exceeded'
  id?: string
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
    id: number | string
    order: number
    sets: Set[]
  }
}

// Grouping function
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
      order: curr.exercise_order,
      sets: [
        {
          reps: curr.reps,
          weight: curr.weight,
          exercise_order: curr.exercise_order,
          created_on: curr.created_on,
          exercise_id: curr.exercise_id,
          performanceStatus: curr.performance_status
        }
      ]
    }
  } else {
    acc[currentExerciseName].sets.push({
      reps: curr.reps,
      weight: curr.weight,
      exercise_order: curr.exercise_order,
      created_on: curr.created_on,
      exercise_id: curr.exercise_id,
      performanceStatus: curr.performance_status
    })
  }

  return acc
}

// Formatted workout interface
export interface FormattedWorkout {
  id: number
  name: string
  created_on: string
  exercises: TransformedExercises // Use ACC type for exercises
}

// Format workouts function
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
