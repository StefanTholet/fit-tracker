import React from 'react'
import Link from 'next/link'
import WorkoutList from './workout-list/workout-list'
import NoWorkouts from './no-workouts'

import { FlatWorkout } from '@/interfaces/workout'
import { getUserWorkouts } from '@/server-actions/workout-actions'
import { getSession } from '../../server-actions/auth-actions'
import { groupWorkouts } from '@/utils/exercise'

const Dashboard = async () => {
  const session = await getSession()
  const userId = session?.userId

  const flatWorkouts = (await getUserWorkouts(userId)) as FlatWorkout[]
  const workouts = Object.values(groupWorkouts(flatWorkouts))
  console.log(workouts)

  return (
    <div className="flex flex-col items-center justify-center  gap-5">
      {workouts && workouts.length > 0 && <WorkoutList workouts={workouts} />}
      {!workouts || workouts.length === 0 ? (
        <div className="max-w-lg">
          <NoWorkouts />
        </div>
      ) : null}
    </div>
  )
}

export default Dashboard
