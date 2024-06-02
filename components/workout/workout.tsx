import React from 'react'
import ExerciseList from './exercise-list'
import { GroupedExerciseSet, GroupedWorkout } from '@/interfaces/workout'
import { SetProps } from '../set/set'

interface WorkoutProps extends GroupedWorkout {
  className?: string
  children: React.ReactNode
  Set: React.ComponentType<SetProps>
}

const Workout = ({
  name,
  createdOn,
  exercises,
  className,
  Set,
  children
}: WorkoutProps) => {
  const exerciseList = Object.keys(exercises).map(
    (exercise: string) => exercises[exercise]
  )

  return (
    <div
      className={`mb-6 px-10 pl-8 py-10 pb-6 border rounded border-gray-300 ${
        className ? className : ''
      }`}
    >
      <h3 className="text-xl font-semibold text-center">{name}</h3>
      {createdOn && (
        <p className="text-gray-500 text-center mt-3">
          Created on: {new Date(createdOn).toLocaleDateString()}
        </p>
      )}
      {exerciseList.map((exercise) => (
        <ExerciseList key={exercise.name}>
          <ExerciseList.Item name={exercise.name}>
            <ExerciseList.Container>
              {exercise.sets.map(
                (set: GroupedExerciseSet, setIndex: number) => {
                  return (
                    <Set
                      key={setIndex}
                      set={set}
                      setIndex={setIndex}
                      exerciseName={exercise.name}
                      exerciseId={exercise.exercise_id}
                    />
                  )
                }
              )}
            </ExerciseList.Container>
          </ExerciseList.Item>
        </ExerciseList>
      ))}
      {children}
    </div>
  )
}

export default Workout
