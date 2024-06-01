'use client'
import React from 'react'
import Link from 'next/link'
import { groupWorkouts } from '@/utils/exercise'
import Workout from '@/components/workout/workout'
import { FlatWorkout } from '@/interfaces/workout'
interface WorkoutComponentProps {
  workouts: FlatWorkout[]
}

const WorkoutList: React.FC<WorkoutComponentProps> = ({ workouts }) => {
  const handleSetClick = (set: { reps: number; weight: number }) => {
    console.log('Set clicked:', set)
    // Add your logic here
  }

  const groupedWorkouts = groupWorkouts(workouts)

  const workoutList = Object.values(groupedWorkouts)

  //TODO extract each workout in its own component
  // Disable sets buttons when viewed inside dashboard
  // Add header actions section as props
  // Add header actions for editting and deleting the workouts
  // Add footer actions section as props
  // Add footer action to start a workout

  // Create logic to show a pop-up of an input when a set button is clicked
  /* Once a value in the input is changed 
   a button-like element will appear beneath the set that was recorded with green background and white text
*/
  // When all sets are completed a green check will appear next to the exercise that was completed

  return (
    <div className="container mx-auto p-4 max-w-fit">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Workouts</h2>
      {workoutList.map((workout, index) => (
        <Workout
          workoutId={workout.workoutId}
          name={workout.name}
          createdOn={workout.createdOn}
          exercises={workout.exercises}
          key={index}
        >
          <div className="mt-4 flex justify-center">
            <Link
              className="btn btn-primary btn-sm"
              href={`/workouts/${workout.workoutId}/train`}
            >
              Begin workout
            </Link>
          </div>
        </Workout>
      ))}
    </div>
  )
}

export default WorkoutList
