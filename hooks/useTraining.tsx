'use client'
import React, { useState } from 'react'
import { addPerformedExercise } from '@/server-actions/workout-actions'
import { useToast } from '@/components/ui/use-toast'
import { TransformedExercises } from '@/utils/exercise'

export interface SetInterface {
  weight: number
  reps: number

  performanceStatus?: string
  [key: string]: any
}

export interface Exercise {
  sets: SetInterface[]
  order: number
  name: string
  id: string | number
}

export interface CompletedSets {
  [key: string]: Exercise
}

interface UseTrainingProps {
  userId: string | number
  workoutId: string | number
  exercises?: TransformedExercises
}

const useTraining = ({ userId, workoutId, exercises }: UseTrainingProps) => {
  const [exerciseData, setExerciseData] = useState<TransformedExercises>(
    exercises ? structuredClone(exercises) : ({} as TransformedExercises)
  )
  const [selectedExercise, setSelectedExercise] = useState(
    exercises ? Object.keys(exercises)[0] : ''
  )
  const [selectedSet, setSelectedSet] = useState(0)

  const [showInput, setShowInput] = useState(false)
  //do I need this?
  const [completedSets, setCompletedSets] = useState<CompletedSets>({})

  const { toast } = useToast()

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

  const getPerformanceStatus = (): 'met' | 'not-met' | 'exceeded' => {
    if (exercises) {
      const targetReps = exercises[selectedExercise].sets[selectedSet].reps
      const performedReps = Number(
        exerciseData[selectedExercise].sets[selectedSet].reps
      )
      const targetWeight = exercises[selectedExercise].sets[selectedSet].weight
      const liftedWeight = Number(
        exerciseData[selectedExercise].sets[selectedSet].weight
      )

      if (targetReps > performedReps || targetWeight > liftedWeight) {
        return 'not-met'
      } else if (performedReps > targetReps || liftedWeight > targetWeight) {
        return 'exceeded'
      }
    }
    return 'met'
  }

  const completeSet = async () => {
    setShowInput(false)
    const exercise = {
      ...exerciseData[selectedExercise]
    }

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

    const currentSet = exercise.sets[selectedSet]

    const requestData = {
      name: exercise.name as string,
      reps: currentSet.reps,
      weight: currentSet.weight,
      performanceStatus: getPerformanceStatus(),
      exerciseId: exercise.id,
      userId,
      workoutId,
      exercise_order: Object.keys(completedSets).length
    }

    try {
      const result = await addPerformedExercise(requestData)
      toast({
        title: `${selectedExercise}`,
        description: `Set ${selectedSet + 1} successfully ${result}!`,
        variant: 'success'
      })
      setExerciseData((state) => {
        const newState = { ...state }
        newState[selectedExercise].sets[selectedSet].performanceStatus =
          getPerformanceStatus()

        return { ...state }
      })
    } catch (error) {
      toast({
        title: 'Something went wrong...',
        description: 'Unable to save your completed set',
        variant: 'destructive'
      })
    }
  }

  const currentExerciseList = exercises
    ? Object.keys(exercises).map((exercise: string) => exercises[exercise])
    : []

  return {
    currentExerciseList,
    exerciseData,
    setExerciseData,
    completeSet,
    showInput,
    handleClickSet,
    handleChange,
    setSelectedExercise,
    selectedExercise,
    selectedSet
  }
}

export default useTraining
