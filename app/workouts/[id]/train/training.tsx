'use client'
import React, { useState } from 'react'
import Workout from '@/components/workout/workout'
import Form from '@/components/form/form'
import Set from '@/components/set/set'
import { SetProps } from '@/components/set/set'
import { GroupedExercise } from '@/interfaces/workout'
import { addPerformedExercise } from '@/server-actions/workout-actions'

export interface SetInterface {
  weight: number
  reps: number
  setIndex: number
  performanceStatus?: string
}

export interface Exercise {
  sets: SetInterface[]
}

export interface CompletedSets {
  [key: string]: Exercise
}

interface TrainingProps {
  createdOn: string
  exercises: GroupedExercise
  name: string
  workoutId: number
  userId: number
}

const performanceStatusStylingMap: { [key: string]: string } = {
  met: 'btn-secondary',
  exceeded: 'btn-primary',
  'not-met': 'btn-accent'
}

const Training = ({
  workoutId,
  userId,
  createdOn,
  exercises,
  name
}: TrainingProps) => {
  const [exerciseData, setExerciseData] = useState({ ...exercises })
  const [showInput, setShowInput] = useState(false)

  const [selectedExercise, setSelectedExercise] = useState(
    Object.keys(exercises)[0]
  )
  const [selectedSet, setSelectedSet] = useState(0)
  const [completedSets, setCompletedSets] = useState<CompletedSets>({})

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
      const exercise = { ...state[selectedExercise] }
      exercise.sets[selectedSet][name] = value
      state[selectedExercise] = exercise
      return { ...state }
    })
  }

  const getPerformanceStatus = () => {
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

  const completeSet = async () => {
    //TODO Add validations
    setShowInput(false)
    const exercise = {
      ...exerciseData[selectedExercise]
    }

    setCompletedSets((state) => {
      const performanceStatus = getPerformanceStatus()
      exercise.sets[selectedSet].performanceStatus = performanceStatus

      const newState = { ...state }

      if (!newState[selectedExercise]) {
        newState[selectedExercise] = { sets: [] }
      }

      newState[selectedExercise].sets = [...exercise.sets]

      return newState
    })

    const currentSet = exercise.sets[selectedSet]
    const requestData = {
      name: exercise.name,
      reps: currentSet.reps,
      weight: currentSet.weight,
      performanceStatus: getPerformanceStatus(),
      exerciseId: exercise.exercise_id,
      userId,
      workoutId
    }
    const result = await addPerformedExercise(requestData)
    console.log(result)
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

  return (
    <Workout
      className="relative"
      createdOn={createdOn}
      exercises={exercises}
      name={name}
      Set={({ set, setIndex, exerciseId, exerciseName }: SetProps) => {
        return (
          <Set
            className={getSetClassName(exerciseName, setIndex)}
            set={set}
            exerciseId={exerciseId}
            exerciseName={exerciseName}
            onClick={(e) => handleClickSet(e, exerciseName, setIndex)}
            setIndex={setIndex}
          />
        )
      }}
    >
      <Form className={`${showInput ? 'opacity-100' : 'opacity-0 h-0'}`}>
        <Form.FormControl label="Weight">
          <Form.Input
            type="number"
            placeholder="weight"
            name="weight"
            value={exerciseData[selectedExercise].sets[selectedSet].weight}
            onChange={handleChange}
          />
        </Form.FormControl>
        <Form.FormControl label="Reps">
          <Form.Input
            type="number"
            placeholder="reps"
            name="reps"
            value={exerciseData[selectedExercise].sets[selectedSet].reps}
            onChange={handleChange}
          />
        </Form.FormControl>
        <button
          type="button"
          onClick={completeSet}
          className="btn btn-primary block m-auto"
        >
          Complete set
        </button>
      </Form>
    </Workout>
  )
}

export default Training
