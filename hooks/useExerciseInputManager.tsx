'use client'
import React, { useState } from 'react'
import { TransformedExercises } from '@/utils/exercise'

export interface SetInterface {
  weight: number
  reps: number

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
  selectedSet: number
}

const useExerciseInputManager = ({
  exercises,
  selectedSet
}: UseExerciseInputManager) => {
  const [exerciseData, setExerciseData] = useState<TransformedExercises>(
    exercises ? structuredClone(exercises) : ({} as TransformedExercises)
  )
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

  return {
    currentExerciseList,
    exerciseData,
    setExerciseData,
    handleChange,
    setSelectedExercise,
    selectedExercise
  }
}

export default useExerciseInputManager
