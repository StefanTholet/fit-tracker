import { getSession } from '@/actions/auth-actions'
import AddWorkouts from '@/components/add-workouts'
import Login from '../login/page'

const AddWorkout = async () => {
  const session = await getSession()
  const { userId } = session || {}
  if (!userId) {
    return <Login />
  }
  return (
    <div className="w-10/12 m-auto flex flex-col">
      <h1 className="text-3xl font-bold mb-4 mx-auto">Add your workouts</h1>
      <AddWorkouts userId={userId} />
    </div>
  )
}

export default AddWorkout
