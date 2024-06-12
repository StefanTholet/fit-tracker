'use client'
import React from 'react'
import WorkoutCard from '@/components/workout-card/workout-card'
import { Label } from '@/components/ui/label'
import Input from '@/components/form/input'
import {
  GroupedExercise,
  GroupedExerciseSet,
  PreviousWorkout
} from '@/interfaces/workout'
import { Button } from '@/components/ui/button'
import useTraining from '@/hooks/useTraining'

interface TrainingProps {
  createdOn: string
  exercises: GroupedExercise
  previousWorkout?: PreviousWorkout
  name: string
  workoutId: number
  userId: number
}

const Training = ({
  workoutId,
  userId,
  createdOn,
  exercises,
  name,
  previousWorkout
}: TrainingProps) => {
  const {
    currentExerciseList,
    completeSet,
    showInput,
    handleClickSet,
    handleChange,
    exerciseData,
    selectedExercise,
    selectedSet
  } = useTraining({ workoutId, userId, exercises })

  return (
    <div className="flex flex-wrap gap-8">
      {previousWorkout && (
        <div>
          <div>
            <h2 className="text-center font-medium text-xl">
              Your previous performance
            </h2>
            <WorkoutCard variant="previous">
              <WorkoutCard.Header
                workoutName={
                  previousWorkout.name +
                  ' ' +
                  new Date(createdOn).toLocaleDateString()
                }
              />
              {Object.values(previousWorkout.exercises).map((exercise, i) => (
                <WorkoutCard.Exercises
                  key={(exercise as GroupedExercise).exercise_id}
                >
                  <WorkoutCard.Exercise
                    name={(exercise as GroupedExercise).name}
                  />
                  <WorkoutCard.SetsContainer>
                    {exercise.sets.map(
                      (set: GroupedExerciseSet, index: number) => (
                        <WorkoutCard.Set
                          key={i + index + 1}
                          reps={set.reps}
                          weight={set.weight}
                          performanceStatus={set.performanceStatus}
                        ></WorkoutCard.Set>
                      )
                    )}
                  </WorkoutCard.SetsContainer>
                </WorkoutCard.Exercises>
              ))}
            </WorkoutCard>
          </div>
        </div>
      )}
      <div>
        {previousWorkout && (
          <h2 className="text-center  font-medium text-xl">
            Today&apos;s plan
          </h2>
        )}
        <WorkoutCard variant="current">
          <WorkoutCard.Header workoutName={name} />
          {currentExerciseList.map((exercise) => (
            <WorkoutCard.Exercises key={exercise.exercise_id}>
              <WorkoutCard.Exercise name={exercise.name} />
              <WorkoutCard.SetsContainer>
                {exercise.sets.map((set: GroupedExerciseSet, index: number) => (
                  <WorkoutCard.Set
                    onClick={(e) => handleClickSet(e, exercise.name, index)}
                    key={index}
                    reps={set.reps}
                    weight={set.weight}
                    performanceStatus={set.performanceStatus}
                    variant="current"
                  />
                ))}
              </WorkoutCard.SetsContainer>
            </WorkoutCard.Exercises>
          ))}
          <div
            className={`flex flex-col gap-4 max-w-48 m-auto ${
              showInput ? 'opacity-100' : 'opacity-0 h-0'
            }`}
          >
            <Label htmlFor="weight">Weight</Label>
            <Input
              className="rounded-md pl-2 border border-solid border-gray-200"
              type="number"
              name="weight"
              id="weight"
              placeholder="weight"
              value={exerciseData[selectedExercise].sets[selectedSet].weight}
              onChange={handleChange}
            />
            <Label htmlFor="reps">Reps</Label>
            <Input
              className="rounded-md pl-2 border border-solid border-gray-200"
              type="number"
              name="reps"
              id="reps"
              placeholder="reps"
              value={exerciseData[selectedExercise].sets[selectedSet].reps}
              onChange={handleChange}
            />
            <Button onClick={completeSet} className="btn   my-5">
              Complete set
            </Button>
          </div>
        </WorkoutCard>
      </div>
    </div>
  )
}

export default Training
