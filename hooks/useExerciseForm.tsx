import React, { useState, ChangeEvent, FormEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Set {
  id: string
  reps: string
  weight: string
  [key: string]: string
}

interface Exercise {
  id: string
  name: string
  sets: Set[]
}

const EXERCISE_INITIAL_STATE: Exercise = {
  id: uuidv4(),
  name: '',
  sets: [{ id: uuidv4(), reps: '1', weight: '0' }],
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
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ): void => {
    const { value, name } = e.target
    setExercises(
      exercises.map((exercise) =>
        exercise.id === id ? { ...exercise, [name]: value } : exercise
      )
    )
  }

  const handleSetChange = (
    e: ChangeEvent<HTMLInputElement>,
    exerciseId: string,
    setId: string
  ): void => {
    const { value, name } = e.target
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.map((set) =>
              set.id === setId ? { ...set, [name]: value } : set
            ),
          }
        }
        return exercise
      })
    )
  }

  const getPreviousSetValues = (sets: Set[], property: string) => {
    const previousSetIndex = sets.length - 1
    return sets[previousSetIndex][property] || '0'
  }

  const addSet = (exerciseId: string): void => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: [
              ...exercise.sets,
              {
                id: uuidv4(),
                reps: getPreviousSetValues(exercise.sets, 'reps'),
                weight: getPreviousSetValues(exercise.sets, 'weight'),
              },
            ],
          }
        }
        return exercise
      })
    )
  }

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises((exercises) =>
      exercises.map((exercise) => {
        const isCurrentExercise = exercise.id === exerciseId
        if (isCurrentExercise) {
          exercise.sets = exercise.sets.filter((set) => set.id !== setId)
        }
        return exercise
      })
    )
  }

  const addExercise = (): void => {
    setExercises([...exercises, { ...EXERCISE_INITIAL_STATE, id: uuidv4() }])
  }

  const removeExercise = (id: string): void => {
    setExercises(exercises.filter((exercise) => exercise.id !== id))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    // Form submission logic here
  }

  return {
    workoutName,
    exercises,
    handleWorkoutNameChange,
    handleExerciseChange,
    addExercise,
    removeExercise,
    handleSetChange,
    addSet,
    removeSet,
    handleSubmit,
  }
}

export default useExerciseForm
