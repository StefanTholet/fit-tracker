import {
  getLastPerformedWorkoutById,
  getWorkout
} from '@/server-actions/workout-actions'
import Training from './training'
import WorkoutCard from '@/components/workout-card/workout-card'
import { formatWorkouts } from '@/utils/exercise'
import { getSession } from '@/server-actions/auth-actions'
import { redirect } from 'next/navigation'
import { GroupedExerciseSet } from '@/interfaces/workout'

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
          exercises={formattedWorkout.exercises}
          name={formattedWorkout.name}
        >
          {/* {previousWorkout && (
            <>
              <h2 className="text-center font-medium text-xl">
                Your previous performance
              </h2>
              <WorkoutCard variant="previous">
                <WorkoutCard.Header
                  workoutName={
                    previousWorkout.name +
                    ' ' +
                    new Date(previousWorkout.created_on).toLocaleDateString()
                  }
                />
                {Object.values(previousWorkout.exercises).map((exercise, i) => (
                  <WorkoutCard.Exercises key={exercise.id}>
                    <WorkoutCard.Exercise name={exercise.name} />
                    <WorkoutCard.SetsContainer>
                      {exercise.sets.map(
                        (set: GroupedExerciseSet, index: number) => (
                          <WorkoutCard.Set
                            key={i + index + 1}
                            reps={set.reps}
                            weight={set.weight}
                            performanceStatus={set.performanceStatus}
                          ></WorkoutCard.Set>
                        )
                      )}
                    </WorkoutCard.SetsContainer>
                  </WorkoutCard.Exercises>
                ))}
              </WorkoutCard>
            </>
          )} */}
        </Training>
      </div>
    </div>
  )
}

export default page
