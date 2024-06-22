'use client'
import React, { useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import WorkoutCard from '@/components/workout-card/workout-card'
import { GroupedExerciseSet } from '@/interfaces/workout'
import { Button } from '@/components/ui/button'
import { FormattedWorkout, TransformedExercises } from '@/utils/exercise'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { addPerformedExercise } from '@/server-actions/workout-actions'
import { v4 as uuidv4 } from 'uuid'
import { Base64 } from 'js-base64'
import Sets from './sets'

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
type acc = {
  [key: string]: boolean
}
const Training: React.FC<TrainingProps> = ({
  workoutId,
  userId,
  createdOn,
  exercises,
  name,
  previousWorkout
}) => {
  const searchParams = useSearchParams()

  const [addSetInputsMap, setAddSetsInputMap] = useState(
    Object.keys(exercises).reduce((acc: acc, curr: string) => {
      acc[curr] = false
      return acc
    }, {})
  )

  const [newSet, setNewSet] = useState<SetInterface>({
    exercise_order: 0,
    reps: 1,
    weight: 1
  })

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

  const submitSet = async (
    exercise: Exercise,
    selectedSet: number,
    performanceStatus: 'met' | 'not-met' | 'exceeded'
  ) => {
    const currentSet = { ...exercise.sets[selectedSet] }
    const id = currentSet.performed_exercise_id || uuidv4()
    const requestData = {
      id: id,
      name: exercise.name as string,
      reps: currentSet.reps,
      weight: currentSet.weight,
      performanceStatus,
      exerciseId: exercise.id,
      userId,
      workoutId,
      exercise_order: Object.keys(getCompletedSets()).length
    }

    try {
      const result = await addPerformedExercise(requestData)
      toast({
        title: `${exercise.name}`,
        description: `Set ${selectedSet + 1} successfully ${result}!`,
        variant: 'success'
      })
      return id
    } catch (error) {
      console.log(error)
      toast({
        title: 'Something went wrong...',
        description: 'Unable to save your completed set',
        variant: 'destructive'
      })
      return null
    }
  }

  const { toast } = useToast()

  let isWorkoutCompleted = useRef(false)

  const toggleAddSetInput = (exerciseName: string) => {
    setAddSetsInputMap((state) => {
      const newState = { ...state }
      newState[exerciseName] = !newState[exerciseName]
      return newState
    })
  }

  const handleSetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e
    const { name, value } = target
    setNewSet((state) => ({ ...state, [name]: value }))
  }

  //TODO
  // const handleSetSave = (exerciseName: string) => {
  //   setExerciseData(state => {
  //     const newState = {...state}
  //     newSet.exerciseId = exerciseData[exerciseName]
  //     state[exerciseName].sets.push(newSet)
  //   })
  // }

  const currentExerciseList = exercises
    ? Object.keys(exercises).map((exercise: string) => exercises[exercise])
    : []

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
              <Sets
                sets={exercise.sets}
                exerciseName={exercise.name}
                submitSet={submitSet}
                id={exercise.id}
                order={exercise.order}
              />
              {/* <Button onClick={() => toggleAddSetInput(exercise.name)}>
                Add set
              </Button>
              <div
                className={`flex flex-col gap-4 max-w-48 m-auto ${
                  addSetInputsMap[exercise.name]
                    ? 'opacity-100'
                    : 'opacity-0 h-0'
                }`}
              >
                <p>Add your set</p>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  className="rounded-md pl-2 border border-solid border-gray-200"
                  type="number"
                  name="weight"
                  id="weight"
                  placeholder="weight"
                  value={newSet.weight}
                  onChange={handleSetChange}
                />
                <Label htmlFor="reps">Reps</Label>
                <Input
                  className="rounded-md pl-2 border border-solid border-gray-200"
                  type="number"
                  name="reps"
                  id="reps"
                  placeholder="reps"
                  value={newSet.reps}
                  onChange={handleSetChange}
                />
                <Button>Save</Button>
              </div> */}
            </WorkoutCard.Exercises>
          ))}
          <div className="p-6">
            <Button>Add exercise</Button>
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
