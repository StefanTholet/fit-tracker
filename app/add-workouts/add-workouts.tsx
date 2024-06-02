'use client'
import React from 'react'
import Button from '@/components/button'
import WorkoutForm from '@/components/workout-form/workout-form'
import useAddWorkouts from '@/hooks/useAddWorkouts'

interface AddWorkoutsProps {
  userId: number
}
const AddWorkouts = ({ userId }: AddWorkoutsProps) => {
  const { workouts, removeWorkoutForm, addWorkout } = useAddWorkouts()

  return (
    <div className="flex flex-col gap-8">
      {workouts.map((workout) => (
        <WorkoutForm
          title="Create workout"
          key={workout.id}
          removeWorkoutForm={() => removeWorkoutForm(workout.id)}
          userId={userId}
        />
      ))}
      <Button className="self-center mt-8" type="primary" onClick={addWorkout}>
        Add Workout
      </Button>
    </div>
  )
}

export default AddWorkouts
