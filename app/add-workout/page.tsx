import AddWorkouts from '@/components/add-workouts'
const AddWorkout = () => {
  return (
    <div className="w-10/12 m-auto flex flex-col">
      <h1 className="text-3xl font-bold mb-4 mt-4 mx-auto">
        Add your workouts
      </h1>
      <AddWorkouts />
    </div>
  )
}

export default AddWorkout
