import { FormEvent } from 'react'
import useWorkoutForm from '@/hooks/useWorkoutForm'
import FormHeader from './form-header'
import Exercises from './exercises'
import { isExerciseValid } from '@/utils/exercise'
import { addWorkout } from '@/lib/data'

interface WorkoutFormProps {
  removeWorkoutForm: () => void
  userId: string
}

const WorkoutForm = ({ removeWorkoutForm, userId }: WorkoutFormProps) => {
  const {
    workoutName,
    exercises,
    handleWorkoutNameChange,
    handleExerciseChange,
    addExercise,
    removeExercise,
    handleSetChange,
    addSet,
    removeSet,
    handleSubmit,
  } = useWorkoutForm({ submitHandler: addWorkout })

  const disableCreateAndAddWorkoutBtns = () =>
    !workoutName ||
    exercises.length === 0 ||
    (exercises.length === 1 && !isExerciseValid(exercises[0]))

  const onSubmit = (e: FormEvent<HTMLFormElement>) => handleSubmit(e, userId)

  return (
    <form
      className="w-full mx-auto mt-8 bg-white p-6 rounded-lg shadow-md"
      onSubmit={onSubmit}
    >
      <FormHeader
        handleWorkoutNameChange={handleWorkoutNameChange}
        workoutName={workoutName}
        removeWorkoutForm={removeWorkoutForm}
      />

      {exercises.map((exercise, index) => (
        <Exercises
          index={index}
          key={exercise.id}
          exercise={exercise}
          removeExercise={() => removeExercise(exercise.id)}
          handleExerciseChange={(e) => handleExerciseChange(e, exercise.id)}
          handleSetChange={handleSetChange}
          addSet={addSet}
          removeSet={removeSet}
        />
      ))}

      <div className="flex justify-between gap-6 mb-4">
        <button
          type="button"
          onClick={addExercise}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
        >
          Add Exercise
        </button>
        <button
          disabled={disableCreateAndAddWorkoutBtns()}
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
        >
          Create Workout
        </button>
      </div>
    </form>
  )
}

export default WorkoutForm
