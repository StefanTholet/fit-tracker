'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'
import FormHeader from './form-header'
import FormBody from './form-body'

export interface Exercise {
  name: string
  sets: string
  reps: string
  weight: string
}

const EXERCISE_INITIAL_STATE = { name: '', sets: '', reps: '', weight: '' }

const WorkoutForm: React.FC = () => {
  const [workoutName, setWorkoutName] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([
    EXERCISE_INITIAL_STATE
  ])

  const handleWorkoutNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setWorkoutName(event.target.value)
  }

  const handleExerciseChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { target } = e
    const { value, name } = target

    setExercises(
      exercises.map((exercise, i) => {
        return i === index ? { ...exercise, [name]: value } : exercise
      })
    )
  }

  const addExercise = (): void => {
    setExercises([...exercises, EXERCISE_INITIAL_STATE])
  }

  const removeExercise = (index: number): void => {
    setExercises((state) => state.slice(0, index))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    console.log({ workoutName, exercises })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-md"
    >
      <FormHeader
        handleWorkoutNameChange={handleWorkoutNameChange}
        workoutName={workoutName}
      />

      {exercises.map((exercise, index) => (
        <FormBody
          index={index}
          // key={uuidv4()}
          exercise={exercise}
          removeExercise={removeExercise}
          handleExerciseChange={handleExerciseChange}
        />
      ))}

      <div className="flex justify-between mb-4">
        <button
          type="button"
          onClick={addExercise}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
        >
          Add Exercise
        </button>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
        >
          Create Workout
        </button>
      </div>
    </form>
  )
}

export default WorkoutForm
