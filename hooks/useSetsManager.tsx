'use client'
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Exercise } from './useExerciseInputManager'
import { TransformedExercises } from '@/utils/exercise'

export interface CompletedSets {
  [key: string]: Exercise
}

interface UseSetsManagerProps {
  exercises: TransformedExercises
  selectedExercise: string
  setSelectedExercise: (exerciseName: string) => void
  selectedSet: number
  setSelectedSet: (setIndex: number) => void
  getPerformanceStatus: () => 'met' | 'not-met' | 'exceeded'
}

const useSetsManager = ({
  selectedExercise,
  setSelectedExercise,
  selectedSet,
  setSelectedSet,
  getPerformanceStatus
}: UseSetsManagerProps) => {
  const [completedSets, setCompletedSets] = useState<CompletedSets>({})

  const [showInput, setShowInput] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const completeSet = async (exercise: Exercise) => {
    setCompletedSets((state) => {
      const performanceStatus = getPerformanceStatus()
      exercise.sets[selectedSet].performanceStatus = performanceStatus
      exercise.sets[selectedSet].exercise_order =
        Object.keys(completedSets).length
      debugger
      const newState = { ...state }

      if (!newState[selectedExercise]) {
        newState[selectedExercise] = {
          sets: [],
          order: exercise.order,
          name: exercise.name,
          id: exercise.id
        }
      }

      newState[selectedExercise].sets = [...exercise.sets]

      return newState
    })
  }

  const handleClickSet = (
    e: React.MouseEvent<HTMLButtonElement>,
    exerciseName: string,
    setIndex: number
  ) => {
    e.preventDefault()
    if (exerciseName !== selectedExercise) {
      setSelectedExercise(exerciseName)
    }
    if (setIndex !== selectedSet) {
      setSelectedSet(setIndex)
    }
    setShowInput(true)
  }

  return {
    showInput,
    completeSet,
    handleClickSet,
    completedSets
  }
}

export default useSetsManager
