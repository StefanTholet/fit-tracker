'use client'
import React, { useState } from 'react'
import WorkoutForm from '@/components/workout-form/workout-form'
import { Workouts } from '@/interfaces/workout'
const WorkoutsList = ({
  workouts,
  userId,
}: {
  workouts: Workouts[]
  userId: string
}) => {
  // make state of arrays that containing objects workouId: workoutId, disabled: boolean (true by default)
  // add logic to enable workouts one by one
  // Remove workout name input for disabled forms
  // Implement logic to pass action buttons beneath each form as children
  // implement edit logic for each form
  return (
    <div>
      {workouts.map((workout: Workouts) => (
        <WorkoutForm
          title={workout.workout_name}
          userId={userId}
          key={workout.workout_id}
          initialState={workout}
        />
      ))}
    </div>
  )
}

export default WorkoutsList
