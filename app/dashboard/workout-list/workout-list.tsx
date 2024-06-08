'use client'
import React from 'react'
import Link from 'next/link'

import { GroupedExerciseSet, GroupedWorkout } from '@/interfaces/workout'
import WorkoutCard from '@/components/workout-card/workout-card'
import { Button } from '@/components/ui/button'
interface WorkoutComponentProps {
  workouts: GroupedWorkout[]
}

const WorkoutList: React.FC<WorkoutComponentProps> = ({ workouts }) => {
  const workoutList = Object.values(workouts)

  return (
    <div className="container mx-auto p-4 max-w-fit">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Workouts</h2>
      {workoutList.map((workout, i) => (
        <WorkoutCard key={workout.workoutId}>
          <WorkoutCard.Header workoutName={workout.name} />
          {Object.values(workout.exercises).map((exercise) => (
            <WorkoutCard.Exercises key={exercise.id}>
              <WorkoutCard.Exercise name={exercise.name} />
              <WorkoutCard.SetsContainer>
                {exercise.sets.map((set: GroupedExerciseSet, index: number) => (
                  <WorkoutCard.Set
                    key={i + index + 1}
                    reps={set.reps}
                    weight={set.weight}
                    performanceStatus={set.performanceStatus}
                  ></WorkoutCard.Set>
                ))}
              </WorkoutCard.SetsContainer>
            </WorkoutCard.Exercises>
          ))}
          <div className="mt-4 flex justify-center pb-7">
            <Button>
              <Link href={`/workouts/${workout.workoutId}/train`}>
                Begin workout
              </Link>
            </Button>
          </div>
        </WorkoutCard>
      ))}
    </div>
  )
}

export default WorkoutList
