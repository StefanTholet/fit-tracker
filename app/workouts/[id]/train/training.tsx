'use client'
import React, { ReactNode, useMemo, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { addExercise } from '@/server-actions/workout-actions'
import Link from 'next/link'
import WorkoutCard from '@/components/workout-card/workout-card'
import { Button } from '@/components/ui/button'
import Sets from './sets'
import { TransformedExercises } from '@/utils/exercise'
import InputGroup from './input-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export interface SetInterface {
  weight: number | string
  reps: number | string
  performed_exercise_id?: string
  order: number
  performanceStatus?: 'met' | 'not-met' | 'exceeded'
  id: string
  created_on?: string | Date
  exercise_id?: string
  [key: string]: any
}

// Define the Exercise interface
export interface Exercise {
  sets: SetInterface[]
  order: number
  name: string
  id: string
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
  const exercisesCopy = useMemo(
    () =>
      exercises
        ? [
            ...Object.keys(structuredClone(exercises)).map(
              (exercise: string) => {
                const setsCopy = exercises[exercise].sets.map((set) => ({
                  ...set
                }))
                return { ...exercises[exercise], sets: setsCopy }
              }
            )
          ]
        : [],
    [exerciseList]
  )

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {children}
      <WorkoutCard variant="current">
        <WorkoutCard.Header workoutName={name}></WorkoutCard.Header>
        {exercisesCopy?.map((exercise, i) => (
          <WorkoutCard.Exercises key={exercise.id}>
            <Sets
              userId={userId}
              workoutId={workoutId}
              sets={exercise.sets}
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
