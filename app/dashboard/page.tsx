import React from 'react'
import Link from 'next/link'
import NoPlan from '@/assets/svg/no-plan'
import { Workouts } from '@/interfaces/workout'
import WorkoutForm from '@/components/workout-form/workout-form'
import { getUserWorkouts } from '@/server-actions/workout-actions'
import { getSession } from '../../server-actions/auth-actions'
import WorkoutsList from './workouts-list'
const Dashboard = async () => {
  const session = await getSession()
  const userId = session?.userId

  const workouts = (await getUserWorkouts(userId)) || []

  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-5">
      {workouts && workouts.length > 0 && <WorkoutsList workouts={workouts} />}
      {!workouts ? (
        <div className="flex flex-col gap-5 align-middle">
          <h1 className="text-2xl font-bold mb-4">
            It appears that you have not created your workout plan yet
          </h1>

          <Link
            href="add-workouts"
            className="btn btn-neutral mb-6 self-center"
          >
            Click here to create your workout plan
          </Link>
        </div>
      ) : null}
      {!workouts ? (
        <div className="max-w-lg">
          <NoPlan />
        </div>
      ) : null}
    </div>
  )
}

export default Dashboard