'use client'
import { useState } from 'react'
import Input from '@/components/form/input'
import Workout from '@/components/workout/workout'
import Form from '@/components/form/form'

import { GroupedExercise } from '@/interfaces/workout'
import useWorkoutForm from '@/hooks/useWorkoutForm'

interface TrainingProps {
  createdOn: string
  exercises: GroupedExercise
  name: string
}

const Training = ({ createdOn, exercises, name }: TrainingProps) => {
  // console.log(exercises)
  // const exerciseList = Object.keys(exercises).map(
  //   (exercise: string) => exercises[exercise]
  // )

  const [exerciseData, setExerciseData] = useState(exercises)
  const [showInput, setShowInput] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(
    Object.keys(exercises)[0]
  )
  const [selectedSet, setSelectedSet] = useState(0)

  const setClickHandler = (e, exerciseName, setIndex) => {
    e.preventDefault()
    if (exerciseName !== selectedExercise) {
      setSelectedExercise(exerciseName)
    }
    if (setIndex !== selectedSet) {
      setSelectedSet(setIndex)
    }
    setShowInput((state) => !state)
  }
  console.log(exerciseData)

  const handleChange = (e) => {
    const { target } = e
    const { value, name } = target

    setExerciseData((state) => {
      const exercise = { ...exerciseData[selectedExercise] }
      exercise.sets[selectedSet][name] = value
      state[selectedExercise] = exercise
      return state
    })
  }
  console.log(exerciseData[selectedExercise].sets[selectedSet])
  return (
    <Workout
      setsClickHandler={setClickHandler}
      className="relateve"
      createdOn={createdOn}
      exercises={exercises}
      name={name}
    >
      <Form className={`${showInput ? 'opacity-100' : 'opacity-0'}`}>
        <Form.FormControl label="Weight">
          <Form.Input
            placeholder="weight"
            name="weight"
            value={exerciseData[selectedExercise].sets[selectedSet].weight}
            onChange={handleChange}
          />
        </Form.FormControl>
        <Form.FormControl label="Reps">
          <Form.Input
            placeholder="reps"
            name="reps"
            value={exerciseData[selectedExercise].sets[selectedSet].weight}
            onChange={handleChange}
          />
        </Form.FormControl>
      </Form>
    </Workout>
  )
}

export default Training
