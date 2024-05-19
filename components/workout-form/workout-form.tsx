'use client'
import useExerciseForm from '@/hooks/useExerciseForm'
import FormHeader from './form-header'
import Exercises from './exercises'
import { isExerciseValid } from '@/utils/exercise'
interface WorkoutFormProps {
  removeWorkoutForm: () => void
}

const WorkoutForm = ({ removeWorkoutForm }: WorkoutFormProps) => {
  const {
    workoutName,
    exercises,
    handleWorkoutNameChange,
    handleExerciseChange,
    addExercise,
    removeExercise,
    handleSubmit
  } = useExerciseForm()

  const disableCreateAndAddWorkoutBtns = () =>
    !workoutName ||
    exercises.length === 0 ||
    (exercises.length === 1 && !isExerciseValid(exercises[0]))

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-md"
    >
      <FormHeader
        handleWorkoutNameChange={handleWorkoutNameChange}
        workoutName={workoutName}
        removeWorkoutForm={removeWorkoutForm}
      />

      {exercises.map((exercise, index) => {
        return (
          <Exercises
            index={index}
            key={exercise.id}
            exercise={exercise}
            removeExercise={() => removeExercise(exercise.id)}
            handleExerciseChange={(e) => handleExerciseChange(e, exercise.id)}
          />
        )
      })}

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
