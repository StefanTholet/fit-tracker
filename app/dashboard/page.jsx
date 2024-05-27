import React from 'react'
import Link from 'next/link'
import NoPlan from '@/assets/svg/no-plan'
import { getWorkouts } from '../../lib/data'
const Dashboard = async () => {
  const workouts = await getWorkouts()
  console.log(workouts[0]?.exercises)
  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-5">
      <div className="flex flex-col gap-5 align-middle">
        {!workouts ? (
          <h1 className="text-2xl font-bold mb-4">
            It appears that you have not created your workout plan yet
          </h1>
        ) : null}
        <Link href="add-workouts" className="btn btn-neutral mb-6 self-center">
          Click here to create your workout plan
        </Link>
      </div>
      {!workouts ? (
        <div className="max-w-lg">
          <NoPlan />
        </div>
      ) : null}
    </div>
  )
}

export default Dashboard
