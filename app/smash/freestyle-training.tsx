'use client'
import React from 'react'
import WorkoutCard from '@/components/workout-card/workout-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import TrashIcon from '@/assets/svg/trash-icon'
import useWorkoutForm from '@/hooks/useWorkoutForm'
import { addWorkout } from '@/server-actions/workout-actions'
import { Workout } from '@/interfaces/workout'
import SetInputs from './set-inputs'
import ExerciseInput from './exercise-input'

const FreestyleTraining = ({ userId }: { userId: string | number }) => {
  const {
    addExercise,
    removeExercise,
    handleExerciseChange,
    addSet,
    removeSet,
    handleSetChange,
    exercises,
    workoutName,
    handleWorkoutNameChange,
  } = useWorkoutForm()

  const handleSubmit = async () => {
    const workout: Workout = {
      name: workoutName,
      exercises,
    }
    try {
      const response = await addWorkout(workout, userId)
      return response
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return (
    <div>
      <WorkoutCard
        className="min-h-96 max-w-80 m-auto p-6"
        containerClassName="max-w-96"
      >
        <WorkoutCard.Header
          workoutName={'Freestyle training'}
          className="p-0"
        />
        <div className="flex flex-col gap-4 justify-start mt-8">
          <Label htmlFor="workoutName">Enter workout name</Label>
          <Input
            id="workoutName"
            name="workoutName"
            value={workoutName}
            onChange={(e) => handleWorkoutNameChange(e.target.value)}
          />
        </div>
        <div className="flex justify-between mt-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Exercises
          </h3>
          <Button onClick={addExercise}>Add exercise</Button>
        </div>
        {exercises.map((exercise) => (
          <div key={exercise.id} className="flex flex-col gap-6">
            <ExerciseInput
              exercise={exercise}
              handleExerciseChange={handleExerciseChange}
            >
              <span
                className="self-center cursor-pointer"
                onClick={() => removeExercise(exercise.id)}
                title="Remove exercise"
              >
                <TrashIcon className={'hover:scale-110'} />
              </span>
            </ExerciseInput>
            <p>Sets</p>
            {exercise.sets.map((set) => (
              <SetInputs
                key={set.id}
                set={set}
                exerciseId={exercise.id}
                handleSetChange={handleSetChange}
                removeSet={removeSet}
              />
            ))}
            <Button className="max-w-28" onClick={() => addSet(exercise.id)}>
              Add set
            </Button>
          </div>
        ))}
        <Button
          onMouseDown={() => handleSubmit()}
          type="submit"
          className="w-full mt-5"
        >
          Save Workout
        </Button>
      </WorkoutCard>
    </div>
  )
}

export default FreestyleTraining
