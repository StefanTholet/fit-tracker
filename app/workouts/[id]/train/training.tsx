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
  updatePlannedSet,
} from '@/server-actions/workout-actions'
import {} from '@/lib/workouts'
import InputGroup from './input-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export interface SetInterface {
  weight: number
  reps: number
  performed_exercise_id?: string
  order: number
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

  children,
}) => {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isEditMode, setIsEditMode] = useState(false)
  const [exerciseList, setExerciseList] = useState(
    exercises
      ? Object.keys(exercises).map((exercise: string) => exercises[exercise])
      : []
  )
  const [showAddExercise, setShowAddExercise] = useState(false)
  const [newExercise, setNewExercise] = useState({
    name: '',
    id: uuidv4(),
    order: 0,
    sets: [{ reps: 1, weight: 10, id: uuidv4(), order: 0 }],
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
      order: Object.keys(getCompletedSets()).length,
    }

    try {
      const result = await addPerformedExercise(requestData)
      toast({
        title: `${exercise.name}`,
        description: `Set ${selectedSet + 1} successfully ${result}!`,
        variant: 'success',
      })
      return id
    } catch (error) {
      console.log(error)
      toast({
        title: 'Something went wrong...',
        description: 'Unable to save your completed set',
        variant: 'destructive',
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
            createdSet,
          ]
          return [...newState]
        })
        toast({
          title: `${exerciseName}`,
          description: 'Set successfully added!',
          variant: 'success',
        })
      }
    } catch (error) {
      toast({
        title: `Something went wrong`,
        description: 'Failed to add set!',
        variant: 'destructive',
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
        variant: 'success',
      })
      return true
    } catch (error) {
      toast({
        title: `Could not save your set changes`,
        variant: 'destructive',
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
        variant: 'success',
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
        variant: 'destructive',
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
      const sets = state.sets[0] as { [key: string]: any }
      return { ...state, [sets[name]]: value }
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
      console.log(insertedExercise)
      console.log(exerciseList[0])
      if (insertedExercise && insertedExercise.id) {
        setExerciseList((state) => {
          const newState = [...state]
          const { id, name, reps, weight, order } = insertedExercise
          debugger
          const newExercise = {
            id,
            name,
            order,
            sets: [
              {
                reps,
                weight,
                order,
                exercise_id: id,
              },
            ],
          }
          return [...newState, newExercise]
        })
      }
    } catch (error) {}
  }

  let isWorkoutCompleted = useRef(false)

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {children}
      <WorkoutCard variant="current" isEditMode={isEditMode}>
        <WorkoutCard.Header workoutName={name} isEditMode={isEditMode}>
          <div
            className={`p-2 rounded transition-colors duration-200 ${
              isEditMode ? 'bg-blue-100' : 'bg-gray-100'
            } hover:bg-blue-200`}
            onClick={() => setIsEditMode((state) => !state)}
          >
            <PencilIcon
              className={`h-4 w-4 cursor-pointer transition-colors duration-200 ${
                isEditMode ? 'text-blue-500' : 'text-gray-500'
              }`}
            />
          </div>
        </WorkoutCard.Header>
        {exerciseList?.map((exercise) => (
          <WorkoutCard.Exercises key={exercise.id}>
            <WorkoutCard.Exercise
              name={exercise.name}
              isEditMode={isEditMode}
            />
            <Sets
              isEditMode={isEditMode}
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
        {isEditMode && (
          <div className="p-6">
            <Button onClick={toggleAddExercise}>Add exercise</Button>
          </div>
        )}
        {isEditMode && (
          <InputGroup
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
            <Button onClick={saveNewExercise} disabled={!newExercise.name}>
              Save exercise
            </Button>
          </InputGroup>
        )}
        {isWorkoutCompleted.current && (
          <Link className="flex justify-center pb-7" href="dashboard">
            <Button>Go to dashboard</Button>
          </Link>
        )}
      </WorkoutCard>
    </div>
  )
}

export default Training
