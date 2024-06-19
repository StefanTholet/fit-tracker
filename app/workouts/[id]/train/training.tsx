'use client'
import React, { useMemo, useState, useRef } from 'react'
import WorkoutCard from '@/components/workout-card/workout-card'
import { Label } from '@/components/ui/label'
import Input from '@/components/form/input'
import { GroupedExerciseSet } from '@/interfaces/workout'
import { Button } from '@/components/ui/button'
import useExerciseInputManager, {
  Exercise
} from '@/hooks/useExerciseInputManager'
import { FormattedWorkout, TransformedExercises } from '@/utils/exercise'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { addPerformedExercise } from '@/server-actions/workout-actions'
import { getPerformanceStatus } from './trainingUtils'
import useSetsManager from '@/hooks/useSetsManager'

interface TrainingProps {
  createdOn: string
  exercises: TransformedExercises
  previousWorkout?: FormattedWorkout
  name: string
  workoutId: number
  userId: number
}

const Training = ({
  workoutId,
  userId,
  createdOn,
  exercises,
  name,
  previousWorkout
}: TrainingProps) => {
  const [selectedSet, setSelectedSet] = useState(0)

  const {
    currentExerciseList,
    handleChange,
    exerciseData,
    selectedExercise,
    setExerciseData,
    setSelectedExercise
  } = useExerciseInputManager({ exercises, selectedSet })

  const targetReps = exercises[selectedExercise].sets[selectedSet].reps
  const performedReps = Number(
    exerciseData[selectedExercise].sets[selectedSet].reps
  )
  const targetWeight = exercises[selectedExercise].sets[selectedSet].weight
  const liftedWeight = Number(
    exerciseData[selectedExercise].sets[selectedSet].weight
  )

  const boundGetPerformanceStatus = () =>
    getPerformanceStatus(targetReps, performedReps, targetWeight, liftedWeight)

  const { showInput, handleClickSet, completedSets, completeSet } =
    useSetsManager({
      exercises,
      selectedExercise,
      setSelectedExercise,
      selectedSet,
      setSelectedSet,
      getPerformanceStatus: boundGetPerformanceStatus
    })

  const submitSet = async (exercise: Exercise) => {
    const currentSet = { ...exercise.sets[selectedSet] }

    const requestData = {
      name: exercise.name as string,
      reps: currentSet.reps,
      weight: currentSet.weight,
      performanceStatus: getPerformanceStatus(
        targetReps,
        performedReps,
        targetWeight,
        liftedWeight
      ),
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
          getPerformanceStatus(
            targetReps,
            performedReps,
            targetWeight,
            liftedWeight
          )

        return { ...state }
      })
      completeSet({ ...exercise })
    } catch (error) {
      toast({
        title: 'Something went wrong...',
        description: 'Unable to save your completed set',
        variant: 'destructive'
      })
    }
  }

  const { toast } = useToast()

  let isWorkoutCompleted = useRef(false)

  const completedSetsArray = Object.values(completedSets)
  useMemo(() => {
    if (completedSetsArray.length === currentExerciseList.length) {
      isWorkoutCompleted.current = completedSetsArray.every((exercise) => {
        return exercise.sets.every((set) => {
          return set.performanceStatus
        })
      })
      if (isWorkoutCompleted) {
        setTimeout(() => {
          toast({ title: 'Workout complete', variant: 'success' })
        }, 1000)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedSets])

  return (
    <div className="flex flex-wrap gap-8">
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
                <WorkoutCard.Exercises key={exercise.id}>
                  <WorkoutCard.Exercise name={exercise.name} />
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
          <h2 className="text-center  font-medium text-xl">
            Today&apos;s plan
          </h2>
        )}
        <WorkoutCard variant="current">
          <WorkoutCard.Header workoutName={name} />
          {currentExerciseList.map((exercise) => (
            <WorkoutCard.Exercises key={exercise.id}>
              <WorkoutCard.Exercise name={exercise.name} />
              <WorkoutCard.SetsContainer>
                {exercise.sets.map((set: GroupedExerciseSet, index: number) => (
                  <WorkoutCard.Set
                    onClick={(e) => handleClickSet(e, exercise.name, index)}
                    key={index}
                    reps={set.reps}
                    weight={set.weight}
                    performanceStatus={
                      exerciseData[exercise.name].sets[index]?.performanceStatus
                    }
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
              className="rounded-md pl-2 border border-solid border-gray-200"
              type="number"
              name="weight"
              id="weight"
              placeholder="weight"
              value={exerciseData[selectedExercise].sets[selectedSet].weight}
              onChange={handleChange}
            />
            <Label htmlFor="reps">Reps</Label>
            <Input
              className="rounded-md pl-2 border border-solid border-gray-200"
              type="number"
              name="reps"
              id="reps"
              placeholder="reps"
              value={exerciseData[selectedExercise].sets[selectedSet].reps}
              onChange={handleChange}
            />
            <Button
              onClick={() => submitSet(exerciseData[selectedExercise])}
              className="btn my-5"
            >
              Complete set
            </Button>
          </div>
          {isWorkoutCompleted.current && (
            <Link className="flex justify-center pb-7" href="dashboard">
              <Button>Go to dashboard</Button>
            </Link>
          )}
        </WorkoutCard>
      </div>
    </div>
  )
}

export default Training
