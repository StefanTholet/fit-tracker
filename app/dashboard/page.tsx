import React from 'react'
import WorkoutList from './workout-list/workout-list'
import NoWorkouts from './no-workouts'
import { getDashboardData } from '@/server-actions/workout-actions'
import { getSession } from '../../server-actions/auth-actions'
import { FormattedWorkout, WorkoutResp, formatWorkouts } from '@/utils/exercise'

interface DashboardData {
  userWorkouts: WorkoutResp[]
  lastPerformedWorkout: WorkoutResp
}

const Dashboard = async () => {
  const session = await getSession()
  const userId = session.userId

  let dashboardData: DashboardData | null = null
  let userWorkouts: FormattedWorkout[] = []
  let lastPerformedWorkout: FormattedWorkout | null = null

  if (userId) {
    dashboardData = await getDashboardData(userId)

    if (dashboardData) {
      userWorkouts = formatWorkouts(dashboardData.userWorkouts)
      if (lastPerformedWorkout) {
        lastPerformedWorkout = formatWorkouts([
          dashboardData.lastPerformedWorkout
        ])[0]
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center  gap-5">
      {userWorkouts && userWorkouts.length > 0 && (
        <WorkoutList
          workouts={userWorkouts}
          lastWorkout={lastPerformedWorkout}
        />
      )}
      {!userWorkouts || userWorkouts.length === 0 ? (
        <div className="max-w-lg">
          <NoWorkouts />
        </div>
      ) : null}
    </div>
  )
}

export default Dashboard
