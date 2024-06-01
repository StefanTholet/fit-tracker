import React from 'react'
import ExerciseList from './exercise-list'
import { GroupedExerciseSet, GroupedWorkout } from '@/interfaces/workout'
const Workout = ({ name, createdOn, exercises }: GroupedWorkout) => {
  const exerciseList = Object.keys(exercises).map(
    (exercise: string) => exercises[exercise]
  )

  return (
    <div className="mb-6 px-10 pl-8 py-10 border rounded border-gray-300">
      <h3 className="text-xl font-semibold text-center">{name}</h3>
      <p className="text-gray-500 text-center mt-3">
        Created on: {new Date(createdOn).toLocaleDateString()}
      </p>
      {exerciseList.map((exercise) => (
        <ExerciseList key={exercise.name}>
          <ExerciseList.Item name={exercise.name}>
            <ExerciseList.Container>
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
            </ExerciseList.Container>
          </ExerciseList.Item>
        </ExerciseList>
      ))}
    </div>
  )
}

export default Workout
