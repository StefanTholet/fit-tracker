import { FlatWorkout, GroupedWorkout } from '@/interfaces/workout'
export const groupWorkouts = (workouts: FlatWorkout[]) =>
  workouts.reduce((acc: GroupedWorkout, workout: FlatWorkout) => {
    console.log(acc)

    if (!acc[workout.workout_id]) {
      acc[workout.workout_id] = {
        name: workout.workout_name,
        createdOn: workout.created_on,
        exercises: {}
      }
    }
    if (!acc[workout.workout_id].exercises[workout.exercise_name]) {
      acc[workout.workout_id].exercises[workout.exercise_name] = {
        name: workout.exercise_name,
        sets: []
      }
    }
    acc[workout.workout_id].exercises[workout.exercise_name].sets.push({
      reps: workout.reps,
      weight: workout.weight
    })
    return acc
  }, {} as GroupedWorkout)
