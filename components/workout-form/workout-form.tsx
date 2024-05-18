'use client'
import useExerciseForm from '@/hooks/useExerciseForm'
import FormHeader from './form-header'
import Exercises from './exercises'

interface WorkoutFormProps {
  removeWorkoutForm: () => void
}

export interface Exercise {
  name: string
  sets: string
  reps: string
  weight: string
  id: string
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

      <div className="flex justify-between mb-4">
        <button
          type="button"
          onClick={addExercise}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
        >
          Add Exercise
        </button>
        <button
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
