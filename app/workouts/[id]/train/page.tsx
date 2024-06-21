import {
  getLastPerformedWorkoutById,
  getWorkout
} from '@/server-actions/workout-actions'
import { formatWorkouts } from '@/utils/exercise'
import Training from './training'
import { getSession } from '@/server-actions/auth-actions'
import { redirect } from 'next/navigation'

interface TrainPageProps {
  params: { id: string }
}

const page = async ({ params }: TrainPageProps) => {
  const { userId } = await getSession()
  const workout = await getWorkout(params.id)
  const lastPerformedWorkout = await getLastPerformedWorkoutById(
    Number(params.id)
  )

  const previousWorkout = formatWorkouts(lastPerformedWorkout)[0]
  const formattedWorkout = formatWorkouts(workout)[0]

  if (!userId) {
    redirect('/login')
  }
  return (
    <div>
      <div className="container mx-auto p-4 max-w-fit">
        <Training
          userId={userId}
          workoutId={Number(params.id)}
          createdOn={formattedWorkout.created_on}
          previousWorkout={previousWorkout}
          exercises={formattedWorkout.exercises}
          name={formattedWorkout.name}
        />
      </div>
    </div>
  )
}

export default page
