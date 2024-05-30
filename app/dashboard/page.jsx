import React from 'react'
import Link from 'next/link'
import NoPlan from '@/assets/svg/no-plan'
import WorkoutTable from '@/components/workout-table/workout-table'
import { getUserWorkouts } from '../../lib/data'
import { getSession } from '../../actions/auth-actions'
const Dashboard = async () => {
  const session = await getSession()
  const workouts = await getUserWorkouts(session.userId)

  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-5">
      <WorkoutTable workouts={workouts} />

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
