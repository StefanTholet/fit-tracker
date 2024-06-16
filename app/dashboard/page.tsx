import React from 'react'
import WorkoutList from './workout-list/workout-list'
import NoWorkouts from './no-workouts'
import { FlatWorkout } from '@/interfaces/workout'
import {
  getDashboardData,
  getUserWorkouts
} from '@/server-actions/workout-actions'
import { getSession } from '../../server-actions/auth-actions'
import { formatWorkouts, groupWorkouts } from '@/utils/exercise'
import { formatWithOptions } from 'util'

const Dashboard = async () => {
  const session = await getSession()
  const userId = session.userId

  let dashboardData = {}
  let userWorkouts = {}
  let lastPerformedWorkout = {}
  console.log(userId)

  if (userId) {
    dashboardData = await getDashboardData(userId)
    console.log(dashboardData)

    userWorkouts = formatWorkouts(dashboardData?.userWorkouts)
    lastPerformedWorkout = formatWorkouts([
      dashboardData.lastPerformedWorkout
    ])[0]
    // console.log(groupWorkouts(userWorkouts))
  }
  // const workouts = Object.values(groupWorkouts(flatWorkouts))
  // console.log(userWorkouts)
  console.log(lastPerformedWorkout)
  // see whats up with latest workout:
  // {
  // workout_id: 76,
  // name: 'Test latest',
  // workout_created_on: 2024-06-16T16:03:18.059Z,
  // exercises: {
  //   exercise_id: 68,
  //   exercise_name: 'Squats',
  //   reps: 1,
  //   weight: 10,
  //   exercise_order: 1,
  //   created_on: '2024-06-16T19:03:18.291904',
  //   Squats: { exercise_name: 'Squats', sets: [Array] },
  //   Deadlift: { exercise_name: 'Deadlift', sets: [Array] },
  //   Press: { exercise_name: 'Press', sets: [Array] }
  // }
}
  return (
    <div className="flex flex-col items-center justify-center  gap-5">
      {/* {workouts && workouts.length > 0 && <WorkoutList workouts={workouts} />}
      {!workouts || workouts.length === 0 ? (
        <div className="max-w-lg">
          <NoWorkouts />
        </div>
      ) : null} */}
    </div>
  )
}

export default Dashboard
