import React, { useState, ChangeEvent, FormEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Exercise } from '@/interfaces/exercise'
const EXERCISE_INITIAL_STATE = {
  name: '',
  sets: '',
  reps: '',
  weight: '',
  id: uuidv4(),
}

const useExerciseForm = () => {
  const [workoutName, setWorkoutName] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([
    EXERCISE_INITIAL_STATE,
  ])

  const handleWorkoutNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setWorkoutName(event.target.value)
  }

  const handleExerciseChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    const { target } = e
    const { value, name } = target
    setExercises(
      exercises.map((exercise) => {
        return exercise?.id === id ? { ...exercise, [name]: value } : exercise
      })
    )
  }

  const addExercise = (): void => {
    setExercises([...exercises, { ...EXERCISE_INITIAL_STATE, id: uuidv4() }])
  }

  const removeExercise = (id: string): void => {
    setExercises((exercises) =>
      exercises.filter((exercise) => exercise.id !== id)
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    // console.log({ workoutName, exercises })
  }

  return {
    workoutName,
    exercises,
    handleWorkoutNameChange,
    handleExerciseChange,
    addExercise,
    removeExercise,
    handleSubmit,
  }
}

export default useExerciseForm
