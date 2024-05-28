import { getSession } from '@/actions/auth-actions'
import AddWorkouts from '@/components/add-workouts'
import { redirect } from 'next/navigation'
const AddWorkout = async () => {
  const session = await getSession()
  // const { isLoggedIn, userId } = session
  if (!session.isLoggedIn) {
    redirect('/login')
  }
  return (
    <div className="w-10/12 m-auto flex flex-col">
      <h1 className="text-3xl font-bold mb-4 mx-auto">Add your workouts</h1>
      <AddWorkouts />
    </div>
  )
}

export default AddWorkout
