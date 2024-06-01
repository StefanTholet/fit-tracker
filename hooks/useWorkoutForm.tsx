'use client'
import { useState, ChangeEvent } from 'react'
import { Exercise, Set, AddWorkoutInitialStateType } from '@/interfaces/workout'
import { v4 as uuidv4 } from 'uuid'

const EXERCISE_INITIAL_STATE: Exercise[] = [
  {
    id: uuidv4(),
    name: '',
    sets: [{ id: uuidv4(), reps: '1', weight: '10' }]
  }
]

interface UseWorkoutFormState {
  workoutName: string
  exercises: Exercise[]
  handleWorkoutNameChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleExerciseChange: (e: ChangeEvent<HTMLInputElement>, id: string) => void
  addExercise: () => void
  removeExercise: (id: string) => void
  handleSetChange: (
    e: ChangeEvent<HTMLInputElement>,
    exerciseId: string,
    setId: string
  ) => void
  addSet: (exerciseId: string) => void
  removeSet: (exerciseId: string, setId: string) => void
}

const useWorkoutForm = (
  initialState: AddWorkoutInitialStateType | undefined = undefined
): UseWorkoutFormState => {
  const [workoutName, setWorkoutName] = useState(
    (initialState && initialState?.workout_name) || ''
  )
  const [exercises, setExercises] = useState<Exercise[]>(
    (initialState && initialState?.exercises) || EXERCISE_INITIAL_STATE
  )

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
            )
          }
        }
        return exercise
      })
    )
  }

  const getPreviousSetValues = (sets: Set[], property: keyof Set) => {
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
                weight: getPreviousSetValues(exercise.sets, 'weight')
              }
            ]
          }
        }
        return exercise
      })
    )
  }

  const removeSet = (exerciseId: string, setId: string): void => {
    setExercises((exercises) =>
      exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: exercise.sets.filter((set) => set.id !== setId)
          }
        }
        return exercise
      })
    )
  }

  const addExercise = (): void => {
    setExercises([...exercises, { ...EXERCISE_INITIAL_STATE[0], id: uuidv4() }])
  }

  const removeExercise = (id: string): void => {
    setExercises(exercises.filter((exercise) => exercise.id !== id))
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
    removeSet
  }
}

export default useWorkoutForm
