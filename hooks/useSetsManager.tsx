'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Exercise } from './useExerciseInputManager'
import { TransformedExercises } from '@/utils/exercise'
import { Base64 } from 'js-base64'

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
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [completedSets, setCompletedSets] = useState<CompletedSets>({})

  const [showInput, setShowInput] = useState(false)

  const completeSet = async (exercise: Exercise) => {
    setCompletedSets((state) => {
      const performanceStatus = getPerformanceStatus()
      exercise.sets[selectedSet].performanceStatus = performanceStatus
      exercise.sets[selectedSet].exercise_order =
        Object.keys(completedSets).length

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

  const buildSearchParams = (completedSets: CompletedSets, url = '?') => {
    const entries = Object.entries(completedSets)
    entries.forEach((entry, i) => {
      const key = entry[0]
      const value = entry[1]
      const lastUrlChar = url[url.length - 1]
      if (lastUrlChar === '?' || lastUrlChar === '}') {
        url += 'exercise=' + key + '=' + JSON.stringify(value)
      }
    })

    return Base64.encode(url)
  }

  useEffect(() => {
    const url = searchParams.get('completedSets')
    const decodedUrl = url ? Base64.decode(url) : null

    if (decodedUrl) {
      const completedSetsUrl = decodedUrl
        .split('exercise=')
        .filter((el) => el !== '?')

      const completedSets: CompletedSets = {}
      completedSetsUrl.forEach((set) => {
        const setData = set.split('=')
        const key = setData[0]
        const value = JSON.parse(setData[1]) as Exercise
        completedSets[key] = value
      })
      setCompletedSets(completedSets)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (Object.keys(completedSets).length > 0) {
      const url = buildSearchParams(completedSets)
      router.replace(pathname + '?completedSets=' + url)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedSets])

  return {
    showInput,
    completeSet,
    handleClickSet,
    completedSets
  }
}

export default useSetsManager
