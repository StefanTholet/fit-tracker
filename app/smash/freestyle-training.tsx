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
    handleWorkoutNameChange
  } = useWorkoutForm()

  const handleSubmit = async () => {
    const workout: Workout = {
      name: workoutName,
      exercises
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
        {exercises.map((exercise, index) => (
          <div
            key={exercise.id}
            className="flex flex-col gap-4 justify-start mt-8"
          >
            <Label htmlFor={exercise.id}>Exercise name</Label>
            <div className="flex gap-3">
              <Input
                id={exercise.id}
                value={exercise.name}
                onChange={(e) =>
                  handleExerciseChange(
                    e.target.name,
                    e.target.value,
                    exercise.id
                  )
                }
                name="name"
                placeholder="Exercise Name"
                className="bg-white dark:bg-gray-600 dark:text-gray-50 border-gray-300 dark:border-gray-500 focus:ring-2"
              />
              <span
                className="self-center cursor-pointer"
                onClick={() => removeExercise(exercise.id)}
              >
                <TrashIcon className={'hover:scale-110'} />
              </span>
            </div>

            <p>Sets</p>
            {exercise.sets.map((set) => (
              <div
                key={set.id}
                className="grid grid-cols-3 items-center gap-4 "
              >
                <Input
                  type="number"
                  value={set.reps}
                  onChange={(e) =>
                    handleSetChange(
                      e.target.name,
                      e.target.value,
                      exercise.id,
                      set.id
                    )
                  }
                  name="reps"
                  placeholder="Reps"
                  className="bg-white dark:bg-gray-600 dark:text-gray-50 border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Input
                  type="number"
                  value={set.weight}
                  onChange={(e) =>
                    handleSetChange(
                      e.target.name,
                      e.target.value,
                      exercise.id,
                      set.id
                    )
                  }
                  name="weight"
                  placeholder="Weight"
                  className="bg-white dark:bg-gray-600 dark:text-gray-50 border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span
                  className="self-center cursor-pointer max-w-fit"
                  onClick={() => removeSet(exercise.id, set.id)}
                >
                  <TrashIcon className={'hover:scale-110'} />
                </span>
              </div>
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
