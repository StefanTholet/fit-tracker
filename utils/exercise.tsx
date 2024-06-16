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

export interface EXERCISE_RESP {
  exercise_id: number
  exercise_name: string
  reps: number
  weight: number
  exercise_order: number
  created_on: Date
  performance_status?: 'met' | 'not-met' | 'exceeded'
}

type Set = {
  reps: number
  weight: number
  exercise_order: number
  created_on: Date
  exercise_id: number
  performance_status?: 'met' | 'not-met' | 'exceeded'
}
export interface EXERCISE_RESP_GROUPED extends EXERCISE_RESP {
  sets: Set[]
}

type ACC = {
  [key: string]: { exercise_name: string; sets: Set[] }
}

export const groupExercises = (acc: ACC, curr: EXERCISE_RESP_GROUPED) => {
  const currentExerciseName = curr?.exercise_name
  const currentExericse = acc[currentExerciseName]
  if (!currentExericse) {
    acc[currentExerciseName] = {
      exercise_name: curr.exercise_name,

      sets: [
        {
          reps: curr.reps,
          weight: curr.weight,
          exercise_order: curr.exercise_order,
          created_on: curr.created_on,
          exercise_id: curr.exercise_id,
          performance_status: curr?.performance_status
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
      performance_status: curr?.performance_status
    })
  }
  return acc
}

export const formatWorkouts = (workouts) => {
  return workouts.map((workout) => {
    workout.exercises = workout.exercises.reduce(groupExercises)
    console.log(workout)

    return workout
  })
}
