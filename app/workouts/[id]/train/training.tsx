'use client'
import React, { useState, useEffect, useRef } from 'react'
import Workout from '@/components/workout/workout'
import WorkoutCard from '@/components/workout-card/workout-card'
import Form from '@/components/form/form'
import { Label } from '@/components/ui/label'
import Input from '@/components/form/input'
import Set from '@/components/set/set'
import { SetProps } from '@/components/set/set'
import {
  GroupedExercise,
  GroupedExerciseSet,
  PreviousWorkout
} from '@/interfaces/workout'
import { addPerformedExercise } from '@/server-actions/workout-actions'
import { Button } from '@/components/ui/button'

export interface SetInterface {
  weight: number
  reps: number
  setIndex: number
  performanceStatus?: string
}

export interface Exercise {
  sets: SetInterface[]
  order: string
}

export interface CompletedSets {
  [key: string]: Exercise
}

interface TrainingProps {
  createdOn: string
  exercises: GroupedExercise
  previousWorkout?: PreviousWorkout
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
  name,
  previousWorkout
}: TrainingProps) => {
  const [exerciseData, setExerciseData] = useState(structuredClone(exercises))
  const [showInput, setShowInput] = useState(false)
  console.log('exercise', exercises)
  console.log('exerciseData', exerciseData)

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
      exercise.sets[selectedSet].exercise_order =
        Object.keys(completedSets).length

      const newState = { ...state }

      if (!newState[selectedExercise]) {
        newState[selectedExercise] = { sets: [], order: exercise.order }
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
      workoutId,
      exercise_order: Object.keys(completedSets).length
    }
    const result = await addPerformedExercise(requestData)
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

  const headingRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    if (headingRef?.current) {
      headingRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])
  console.log(previousWorkout)
  const currentExerciseList = Object.keys(exercises).map(
    (exercise: string) => exercises[exercise]
  )
  return (
    <div className="flex">
      {previousWorkout && (
        <div>
          <div>
            <h2 className="text-center font-medium text-xl">
              Your previous performance
            </h2>
            <WorkoutCard variant="previous">
              <WorkoutCard.Header
                workoutName={
                  previousWorkout.name +
                  ' ' +
                  new Date(createdOn).toLocaleDateString()
                }
              />
              {Object.values(previousWorkout.exercises).map((exercise, i) => (
                <WorkoutCard.Exercises
                  key={(exercise as GroupedExercise).exercise_id}
                >
                  <WorkoutCard.Exercise
                    name={(exercise as GroupedExercise).name}
                  />
                  <WorkoutCard.SetsContainer>
                    {exercise.sets.map(
                      (set: GroupedExerciseSet, index: number) => (
                        <WorkoutCard.Set
                          key={i + index + 1}
                          reps={set.reps}
                          weight={set.weight}
                          performanceStatus={set.performanceStatus}
                        ></WorkoutCard.Set>
                      )
                    )}
                  </WorkoutCard.SetsContainer>
                </WorkoutCard.Exercises>
              ))}
            </WorkoutCard>
          </div>
        </div>
      )}
      <div>
        {previousWorkout && (
          <h2 ref={headingRef} className="text-center  font-medium text-xl">
            Today&apos;s plan
          </h2>
        )}
        <WorkoutCard variant="current">
          <WorkoutCard.Header workoutName={name} />
          {currentExerciseList.map((exercise) => (
            <WorkoutCard.Exercises key={exercise.exercise_id}>
              <WorkoutCard.Exercise name={exercise.name} />
              <WorkoutCard.SetsContainer>
                {exercise.sets.map((set: GroupedExerciseSet, index: number) => (
                  <WorkoutCard.Set
                    onClick={(e) => handleClickSet(e, exercise.name, index)}
                    key={index}
                    reps={set.reps}
                    weight={set.weight}
                    performanceStatus={set.performanceStatus}
                    variant="current"
                  />
                ))}
              </WorkoutCard.SetsContainer>
            </WorkoutCard.Exercises>
          ))}
          <div
            className={`flex flex-col gap-4 max-w-48 m-auto ${
              showInput ? 'opacity-100' : 'opacity-0 h-0'
            }`}
          >
            <Label htmlFor="weight">Weight</Label>
            <Input
              className="rounded-md pl-2"
              type="number"
              name="weight"
              id="weight"
              placeholder="weight"
              value={exerciseData[selectedExercise].sets[selectedSet].weight}
              onChange={handleChange}
            />
            <Label htmlFor="reps">Reps</Label>
            <Input
              className="rounded-md pl-2"
              type="number"
              name="reps"
              id="reps"
              placeholder="reps"
              value={exerciseData[selectedExercise].sets[selectedSet].reps}
              onChange={handleChange}
            />
            <Button onClick={completeSet} className="btn   my-5">
              Complete set
            </Button>
          </div>
        </WorkoutCard>
      </div>
    </div>
  )
}

export default Training
