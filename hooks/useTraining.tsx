'use client'
import React, { useState } from 'react'
import { addPerformedExercise } from '@/server-actions/workout-actions'
import { GroupedExercise } from '@/interfaces/workout'
import { useToast } from '@/components/ui/use-toast'

const performanceStatusStylingMap: { [key: string]: string } = {
  met: 'btn-secondary',
  exceeded: 'btn-primary',
  'not-met': 'btn-accent'
}

export interface SetInterface {
  weight: number
  reps: number
  setIndex: number
  performanceStatus?: string
  [key: string]: any // Allow dynamic keys
}

export interface Exercise {
  sets: SetInterface[]
  order: number
  name: string
  exercise_id: string
}

export interface CompletedSets {
  [key: string]: Exercise
}

interface UseTrainingProps {
  userId: string | number
  workoutId: string | number
  exercises?: GroupedExercise
}

const useTraining = ({ userId, workoutId, exercises }: UseTrainingProps) => {
  const [exerciseData, setExerciseData] = useState<GroupedExercise>(
    exercises ? structuredClone(exercises) : ({} as GroupedExercise)
  )
  const [selectedExercise, setSelectedExercise] = useState(
    exercises ? Object.keys(exercises)[0] : ''
  )
  const [selectedSet, setSelectedSet] = useState(0)

  const [showInput, setShowInput] = useState(false)

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
        : { sets: [], name: '', exercise_id: '', order: 0 }
      exercise.sets[selectedSet][name] = value
      state[selectedExercise] = exercise
      return { ...state }
    })
  }

  const getPerformanceStatus = () => {
    if (exercises) {
      const targetReps = exercises[selectedExercise].sets[selectedSet].reps
      const performedReps = Number(
        exerciseData[selectedExercise].sets[selectedSet].reps
      )
      const targetWeight = exercises[selectedExercise].sets[selectedSet].weight
      const liftedWeight = Number(
        exerciseData[selectedExercise].sets[selectedSet].weight
      )

      let performanceStatus = 'met'
      if (targetReps > performedReps || targetWeight > liftedWeight) {
        performanceStatus = 'not-met'
      } else if (performedReps > targetReps || liftedWeight > targetWeight) {
        performanceStatus = 'exceeded'
      }
      return performanceStatus
    }
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
          exercise_id: exercise.exercise_id
        }
      }

      newState[selectedExercise].sets = [...exercise.sets]

      return newState
    })

    const currentSet = exercise.sets[selectedSet]

    const requestData = {
      name: exercise.name as string,
      reps: currentSet.reps as string,
      weight: currentSet.weight,
      performanceStatus: getPerformanceStatus(),
      exerciseId: exercise.exercise_id,
      userId,
      workoutId,
      exercise_order: Object.keys(completedSets).length
    }
    const result = await addPerformedExercise(requestData)
    toast({ title: 'Set completed!', variant: 'success' })
    return result
  }
  const getSetClassName = (exerciseName: string, setIndex: number) => {
    if (setIndex !== undefined && exerciseName) {
      const selectedExercise = completedSets[exerciseName]
      const hasSets = selectedExercise?.sets
      if (hasSets && selectedExercise.sets[setIndex]?.performanceStatus) {
        return performanceStatusStylingMap[
          selectedExercise.sets[setIndex].performanceStatus!
        ]
      }
    }
    return ''
  }

  const currentExerciseList = exercises
    ? Object.keys(exercises).map((exercise: string) => exercises[exercise])
    : []

  return {
    currentExerciseList,
    exerciseData,
    setExerciseData,
    getSetClassName,
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
