import { getWorkout } from '@/server-actions/workout-actions'
import { groupWorkouts } from '@/utils/exercise'
import Training from './training'
import { getSession } from '@/server-actions/auth-actions'
import { redirect } from 'next/navigation'

interface TrainPageProps {
  params: { id: string }
}

const page = async ({ params }: TrainPageProps) => {
  const workout = await getWorkout(params.id)
  const { userId } = await getSession()
  const groupedWorkout = groupWorkouts(workout)[params.id]

  if (!userId) {
    redirect('/login')
  }
  return (
    <div>
      <div className="container mx-auto p-4 max-w-fit">
        <Training
          userId={userId}
          workoutId={Number(params.id)}
          createdOn={groupedWorkout.createdOn}
          exercises={groupedWorkout.exercises}
          name={groupedWorkout.name}
        />
      </div>
    </div>
  )
}

export default page
