'use client'
import React from 'react'
import Link from 'next/link'

import WorkoutCard from '@/components/workout-card/workout-card'
import { Button } from '@/components/ui/button'
import { FormattedWorkout } from '@/utils/exercise'
interface WorkoutComponentProps {
  workouts: FormattedWorkout[]
  lastWorkout?: FormattedWorkout | null
}

const WorkoutList: React.FC<WorkoutComponentProps> = ({
  workouts = [],
  lastWorkout
}) => {
  return (
    <div className="container mx-auto p-4 max-w-fit">
      {lastWorkout && (
        <div className="mb-9">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Your latest performance
          </h2>
          <WorkoutCard key={lastWorkout.id}>
            <WorkoutCard.Header workoutName={lastWorkout.name} />
            {Object.values(lastWorkout.exercises).map((exercise, i) => (
              <WorkoutCard.Exercises key={exercise.id}>
                <WorkoutCard.Exercise name={exercise.name} />
                <WorkoutCard.SetsContainer>
                  {exercise.sets.map((set, index: number) => (
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
                <Link href={`/workouts/${lastWorkout.id}/train`}>
                  Begin workout
                </Link>
              </Button>
            </div>
          </WorkoutCard>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4 text-center">Your Workouts</h2>
      {workouts.map((workout, i) => (
        <WorkoutCard key={workout.id}>
          <WorkoutCard.Header workoutName={workout.name} />
          {Object.values(workout.exercises).map((exercise) => (
            <WorkoutCard.Exercises key={exercise.id}>
              <WorkoutCard.Exercise name={exercise.name} />
              <WorkoutCard.SetsContainer>
                {exercise.sets.map((set, index: number) => (
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
              <Link href={`/workouts/${workout.id}/train`}>Begin workout</Link>
            </Button>
          </div>
        </WorkoutCard>
      ))}
    </div>
  )
}

export default WorkoutList
