import { getWorkout } from '@/server-actions/workout-actions'
import { groupWorkouts } from '@/utils/exercise'
import Training from './training'

interface TrainPageProps {
  params: { id: string }
}

const page = async ({ params }: TrainPageProps) => {
  const workout = await getWorkout(params.id)
  const groupedWorkout = groupWorkouts(workout)[params.id]

  return (
    <div>
      <div className="container mx-auto p-4 max-w-fit">
        <Training
          createdOn={groupedWorkout.createdOn}
          exercises={groupedWorkout.exercises}
          name={groupedWorkout.name}
        />
      </div>
    </div>
  )
}

export default page
