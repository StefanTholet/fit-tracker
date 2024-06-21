'use client'
import React, { useState } from 'react'
import { TransformedExercises } from '@/utils/exercise'

export interface SetInterface {
  weight: number
  reps: number
  performed_exercise_id?: string
  exercise_order: number
  performanceStatus?: 'met' | 'not-met' | 'exceeded'
  [key: string]: any
}

export interface Exercise {
  sets: SetInterface[]
  order: number
  name: string
  id: string | number
}

interface UseExerciseInputManager {
  exercises?: TransformedExercises
}

const useExerciseInputManager = ({ exercises }: UseExerciseInputManager) => {
  const [exerciseData, setExerciseData] = useState<TransformedExercises>(
    exercises ? structuredClone(exercises) : ({} as TransformedExercises)
  )
  const [selectedSet, setSelectedSet] = useState(0)
  const [showInput, setShowInput] = useState(false)

  const [selectedExercise, setSelectedExercise] = useState(
    exercises ? Object.keys(exercises)[0] : ''
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e
    const { value, name } = target

    setExerciseData((state) => {
      const exercise = state[selectedExercise]
        ? { ...state[selectedExercise] }
        : { sets: [], name: '', id: '', order: 0 }

      exercise.sets[selectedSet][name] = value
      state[selectedExercise] = exercise
      return { ...state }
    })
  }

  const currentExerciseList = exercises
    ? Object.keys(exercises).map((exercise: string) => exercises[exercise])
    : []

  const handleClickSet = (
    e: React.MouseEvent<HTMLButtonElement>,
    exerciseName: string,
    setIndex: number
  ) => {
    e.preventDefault()
    if (
      setIndex === selectedSet &&
      exerciseName === selectedExercise &&
      showInput
    ) {
      setShowInput(false)
      setSelectedExercise(exercises ? Object.keys(exercises)[0] : '')
      setSelectedSet(0)
      return
    }
    if (exerciseName !== selectedExercise) {
      setSelectedExercise(exerciseName)
    }
    if (setIndex !== selectedSet) {
      setSelectedSet(setIndex)
    }

    setShowInput(true)
  }

  return {
    currentExerciseList,
    exerciseData,
    setExerciseData,
    handleChange,
    setSelectedExercise,
    selectedExercise,
    showInput,
    handleClickSet,
    selectedSet
  }
}

export default useExerciseInputManager
