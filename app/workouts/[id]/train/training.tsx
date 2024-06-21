'use client'
import React, { useRef, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
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

import { v4 as uuidv4 } from 'uuid'
import { Base64 } from 'js-base64'
import { buildSearchParams } from './utils'

export interface CompletedSets {
  [key: string]: Exercise
}
interface TrainingProps {
  createdOn: string
  exercises: TransformedExercises
  previousWorkout?: FormattedWorkout
  name: string
  workoutId: number
  userId: number
}

const Training: React.FC<TrainingProps> = ({
  workoutId,
  userId,
  createdOn,
  exercises,
  name,
  previousWorkout
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const {
    currentExerciseList,
    handleChange,
    exerciseData,
    selectedExercise,
    setExerciseData,
    showInput,
    handleClickSet,
    selectedSet
  } = useExerciseInputManager({ exercises })

  const targetReps = exercises[selectedExercise]?.sets[selectedSet]?.reps
  const performedReps = Number(
    exerciseData[selectedExercise]?.sets[selectedSet]?.reps
  )
  const targetWeight = exercises[selectedExercise]?.sets[selectedSet]?.weight
  const liftedWeight = Number(
    exerciseData[selectedExercise]?.sets[selectedSet]?.weight
  )

  const getCompletedSets = () => {
    const url = searchParams.get('completedSets')
    const decodedUrl = url ? Base64.decode(url) : null

    if (decodedUrl) {
      const exercises = decodedUrl
        .split('exercise=')
        .filter((el) => el !== '?' && el !== '')

      const completedSets: CompletedSets = {}
      exercises.forEach((set) => {
        const setStringArray = set.split('=')
        const exerciseName = setStringArray[0]
        const setData = JSON.parse(setStringArray[1])
        completedSets[exerciseName] = setData
      })
      return completedSets
    }
    return {}
  }

  const submitSet = async (exercise: Exercise) => {
    const currentSet = { ...exercise.sets[selectedSet] }
    const id = currentSet.performed_exercise_id || uuidv4()
    const requestData = {
      id: id,
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
      exercise_order: Object.keys(getCompletedSets()).length
    }

    try {
      const result = await addPerformedExercise(requestData)
      toast({
        title: `${selectedExercise}`,
        description: `Set ${selectedSet + 1} successfully ${result}!`,
        variant: 'success'
      })
      currentSet.performed_exercise_id = id
      currentSet.performanceStatus = getPerformanceStatus(
        targetReps,
        performedReps,
        targetWeight,
        liftedWeight
      )
      const newParams = buildSearchParams(
        searchParams.get('completedSets'),
        pathname,
        selectedExercise,
        currentSet
      )
      router.replace(newParams, { scroll: false })
      setExerciseData((state) => {
        const newState = { ...state }
        newState[selectedExercise].sets[selectedSet].performed_exercise_id = id
        newState[selectedExercise].sets[selectedSet].performanceStatus =
          getPerformanceStatus(
            targetReps,
            performedReps,
            targetWeight,
            liftedWeight
          )
        return { ...state }
      })
    } catch (error) {
      console.log(error)

      toast({
        title: 'Something went wrong...',
        description: 'Unable to save your completed set',
        variant: 'destructive'
      })
    }
  }

  const { toast } = useToast()

  let isWorkoutCompleted = useRef(false)
  const divRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const url = searchParams.get('completedSets')
    const decodedUrl = url ? Base64.decode(url) : null

    if (decodedUrl) {
      const completedSetsUrl = decodedUrl
        .split('exercise=')
        .filter((el) => el !== '?' && el !== '')

      completedSetsUrl.forEach((set) => {
        const setData = set.split('=')
        const exerciseName = setData[0]

        const completedSet = JSON.parse(setData[1])
        setExerciseData((state) => {
          let newState = { ...state }

          newState[exerciseName].sets = newState[exerciseName].sets.map(
            (set) => {
              if (set.exercise_order === completedSet.exercise_order) {
                set.performed_exercise_id = completedSet.performed_exercise_id
                set.performanceStatus = completedSet.performanceStatus
              }
              return set
            }
          )
          return newState
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const { current } = divRef
    if (current && showInput) {
      current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [showInput])

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
      <div className="self-start">
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
                {exercise.sets.map((set: GroupedExerciseSet, index: number) => {
                  const isSelected =
                    exercise.name === selectedExercise &&
                    selectedSet === index &&
                    showInput
                  return (
                    <WorkoutCard.Set
                      selected={isSelected}
                      onClick={(e) => handleClickSet(e, exercise.name, index)}
                      key={index}
                      reps={set.reps}
                      weight={set.weight}
                      performanceStatus={
                        exerciseData[exercise.name]?.sets[index]
                          ?.performanceStatus
                      }
                      variant="current"
                    />
                  )
                })}
              </WorkoutCard.SetsContainer>
            </WorkoutCard.Exercises>
          ))}
          <div
            ref={divRef}
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
              value={exerciseData[selectedExercise]?.sets[selectedSet]?.weight}
              onChange={handleChange}
            />
            <Label htmlFor="reps">Reps</Label>
            <Input
              className="rounded-md pl-2 border border-solid border-gray-200"
              type="number"
              name="reps"
              id="reps"
              placeholder="reps"
              value={exerciseData[selectedExercise]?.sets[selectedSet]?.reps}
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
