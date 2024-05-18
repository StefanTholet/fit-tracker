'use client'
import React from 'react'
import Button from '@/components/button'
import WorkoutForm from '@/components/workout-form/workout-form'
import useAddWorkouts from '@/hooks/useAddWorkouts'

const AddWorkouts = () => {
  const { workouts, removeWorkoutForm, addWorkout } = useAddWorkouts()
  return (
    <div className="flex flex-col gap-8">
      {workouts.map((workout) => (
        <WorkoutForm
          key={workout.id}
          removeWorkoutForm={() => removeWorkoutForm(workout.id)}
        />
      ))}
      <Button className="self-center mt-8" onClick={addWorkout}>
        Add Workout
      </Button>
    </div>
  )
}

export default AddWorkouts
