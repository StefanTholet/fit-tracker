import React from 'react'
import { GroupedExerciseSet, GroupedWorkout } from '@/interfaces/workout'
const Workout = ({ name, createdOn, exercises }: GroupedWorkout) => {
  return (
    <div className="mb-6 px-10 pl-8 py-10 border rounded border-gray-300">
      <h3 className="text-xl font-semibold text-center">{name}</h3>
      <p className="text-gray-500 text-center mt-3">
        Created on: {new Date(createdOn).toLocaleDateString()}
      </p>
      <ol className="list-decimal pl-6 mt-2">
        {Object.values(exercises).map((exercise, exerciseIndex) => (
          <li key={exerciseIndex} className="border-b border-gray-300 py-2">
            <h4 className="text-lg">{exercise.name}</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {exercise.sets.map(
                (set: GroupedExerciseSet, setIndex: number) => (
                  <button
                    key={setIndex}
                    // onClick={() => handleSetClick(set)}
                    className="btn btn-outline btn-sm"
                  >
                    {set.reps} x {set.weight}
                  </button>
                )
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Workout
