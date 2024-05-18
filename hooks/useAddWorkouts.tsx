import { useState } from 'react'
import { Exercise } from '@/components/workout-form/workout-form'
import { v4 as uuidv4 } from 'uuid'

interface Workout {
  id: string
  exercises: Exercise[]
}

const useAddWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: uuidv4(), exercises: [] }
  ])

  const addWorkouts = (id: string, exercises: Exercise[]) => {
    setWorkouts((workouts) =>
      workouts.map((workout) =>
        workout.id === id
          ? { ...workout, exercises: exercises }
          : { ...workout }
      )
    )
  }

  const removeWorkoutForm = (id: string) => {
    setWorkouts((workouts) => workouts.filter((workout) => workout.id !== id))
  }

  const addWorkout = () => {
    setWorkouts((workouts) => [...workouts, { id: uuidv4(), exercises: [] }])
  }

  return { workouts, addWorkout, removeWorkoutForm, addWorkouts }
}

export default useAddWorkouts
