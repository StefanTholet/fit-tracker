'use client'
import React from 'react'
import { groupWorkouts } from './utils'
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
        <div
          key={index}
          className="mb-6 px-10 pl-8 py-10 border rounded border-gray-300"
        >
          <h3 className="text-xl font-semibold text-center">{workout.name}</h3>
          <p className="text-gray-500 text-center mt-3">
            Created on: {new Date(workout.createdOn).toLocaleDateString()}
          </p>
          <ol className="list-decimal pl-6 mt-2">
            {Object.values(workout.exercises).map((exercise, exerciseIndex) => (
              <li key={exerciseIndex} className="border-b border-gray-300 py-2">
                <h4 className="text-lg">{exercise.name}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {exercise.sets.map((set, setIndex) => (
                    <button
                      key={setIndex}
                      onClick={() => handleSetClick(set)}
                      className="btn btn-outline btn-sm"
                    >
                      {set.reps} x {set.weight}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}

export default WorkoutList
