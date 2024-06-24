'use client'
import React, { ReactNode, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useSearchParams } from 'next/navigation'
import { Base64 } from 'js-base64'
import Link from 'next/link'
import WorkoutCard from '@/components/workout-card/workout-card'
import { Button } from '@/components/ui/button'
import Sets from './sets'
import PencilIcon from '@/assets/svg/pencil-icon'
import { useToast } from '@/components/ui/use-toast'
import { TransformedExercises } from '@/utils/exercise'
import { GroupedExerciseSet } from '@/interfaces/workout'
import {
  addExercise,
  addPerformedExercise,
  deletePlannedSet,
  updatePlannedSet
} from '@/server-actions/workout-actions'
import {} from '@/lib/workouts'
import InputGroup from './input-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import FilePenIcon from '@/assets/svg/file-pen-icon'

// Define the SetInterface properly
export interface SetInterface {
  weight: number
  reps: number
  performed_exercise_id?: string
  order: number
  performanceStatus?: 'met' | 'not-met' | 'exceeded'
  id?: string
  created_on?: string | Date
  exercise_id?: string
  [key: string]: any
}

// Define the Exercise interface
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
  name: string
  workoutId: number
  userId: number
  children?: ReactNode
}

const Training: React.FC<TrainingProps> = ({
  workoutId,
  userId,
  createdOn,
  exercises,
  name,
  children
}) => {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [exerciseList, setExerciseList] = useState<Exercise[]>(
    exercises
      ? Object.keys(exercises).map((exercise: string) => exercises[exercise])
      : []
  )
  const [showAddExercise, setShowAddExercise] = useState(false)
  const [newExercise, setNewExercise] = useState<Exercise>({
    name: '',
    id: uuidv4(),
    order: 0,
    sets: [{ reps: 1, weight: 10, id: uuidv4(), order: 0 }]
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
      order: Object.keys(getCompletedSets()).length
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

  const addNewSet = async (
    exerciseName: string,
    newSet: GroupedExerciseSet
  ) => {
    try {
      const createdSet = await addExercise(
        workoutId,
        userId,
        exerciseName,
        newSet.weight,
        newSet.reps,
        newSet.order
      )

      if (createdSet) {
        setExerciseList((state) => {
          const newState = [...state]
          const exerciseIndex = newState.findIndex(
            (ex) => ex.name === exerciseName
          )

          newState[exerciseIndex].sets = [
            ...newState[exerciseIndex].sets,
            createdSet
          ]
          return [...newState]
        })
        toast({
          title: `${exerciseName}`,
          description: 'Set successfully added!',
          variant: 'success'
        })
      }
    } catch (error) {
      toast({
        title: `Something went wrong`,
        description: 'Failed to add set!',
        variant: 'destructive'
      })
    }
  }

  const editSet = async (
    exerciseId: string | number,
    reps: number | string,
    weight: number | string,
    order: number
  ) => {
    try {
      await updatePlannedSet(exerciseId, reps, weight, order)
      toast({
        title: `Set changes`,
        description: 'Successfully saved!',
        variant: 'success'
      })
      return true
    } catch (error) {
      toast({
        title: `Could not save your set changes`,
        variant: 'destructive'
      })
      return null
    }
  }

  const deleteSet = async (exerciseId: string, exerciseName: string) => {
    try {
      const result = await deletePlannedSet(exerciseId)
      toast({
        title: `Set`,
        description: 'Successfully deleted!',
        variant: 'success'
      })
      setExerciseList((state) => {
        const newState = [...state]
        const exerciseIndex = newState.findIndex(
          (exercise) => exercise.name === exerciseName
        )
        newState[exerciseIndex].sets = newState[exerciseIndex].sets.filter(
          (set) => set.exercise_id !== exerciseId
        )
        return newState
      })
    } catch (error) {
      toast({
        title: `Could not delete set`,
        description: 'Please try again later',
        variant: 'destructive'
      })
    } finally {
      return true
    }
  }

  const toggleAddExercise = () => setShowAddExercise((state) => !state)

  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e
    const { name, value } = target
    setNewExercise((state) => {
      if (name === 'name') {
        return { ...state, [name]: value }
      }
      const set = { ...state.sets[0] }
      set[name] = value
      return { ...state, sets: [{ ...set }] }
    })
  }

  const saveNewExercise = async () => {
    try {
      const lastExerciseIndex = exerciseList.length - 1
      const lastExercise = { ...exerciseList[lastExerciseIndex] }
      const lastSetIndex = lastExercise.sets.length - 1
      const order = lastExercise.sets[lastSetIndex].order
      const insertedExercise = await addExercise(
        workoutId,
        userId,
        newExercise.name,
        newExercise.sets[0].weight,
        newExercise.sets[0].reps,
        order
      )

      if (insertedExercise && insertedExercise.id) {
        setExerciseList((state) => {
          const newState = [...state]
          const { id, name, reps, weight, order, created_on } = insertedExercise

          const newExercise = {
            id,
            name,
            order,
            sets: [
              {
                reps,
                weight,
                order,
                id,
                created_on
              }
            ]
          }
          return [...newState, newExercise]
        })
        setShowAddExercise(false)
      }
    } catch (error) {}
  }

  let isWorkoutCompleted = useRef(false)

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {children}
      <WorkoutCard variant="current">
        <WorkoutCard.Header workoutName={name}></WorkoutCard.Header>
        {exerciseList?.map((exercise) => (
          <WorkoutCard.Exercises key={exercise.id}>
            <Sets
              addSet={addNewSet}
              editSet={editSet}
              sets={exercise.sets}
              deleteSet={deleteSet}
              submitSet={submitSet}
              exerciseName={exercise.name}
              id={exercise.id}
              order={exercise.order}
            />
          </WorkoutCard.Exercises>
        ))}

        <div className="p-6">
          <Button
            onClick={toggleAddExercise}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-10 px-4 py-2 w-full text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
          >
            Add exercise
          </Button>
        </div>

        <InputGroup
          className="p-6"
          handleChange={handleExerciseChange}
          set={newExercise.sets[0]}
          showInput={showAddExercise}
          topInputs={
            <>
              <Label>Exercise name</Label>
              <Input
                onChange={handleExerciseChange}
                name="name"
                value={newExercise.name}
              />
            </>
          }
        >
          <Button
            onClick={saveNewExercise}
            disabled={!newExercise.name}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            Save exercise
          </Button>
        </InputGroup>

        {isWorkoutCompleted.current && (
          <Link className="flex justify-center pb-7" href="dashboard">
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              Go to dashboard
            </Button>
          </Link>
        )}
      </WorkoutCard>
    </div>
  )
}

export default Training
