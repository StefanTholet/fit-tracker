import { FormEvent } from 'react'
import useWorkoutForm from '@/hooks/useWorkoutForm'
import FormHeader from './form-header'
import Exercises from './exercises'
import Form from './form'
import CloseIcon from '../close-icon'
import { isExerciseValid } from '@/utils/exercise'
import { addWorkout } from '@/server-actions/workout-actions'

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
    <Form onSubmit={onSubmit}>
      <FormHeader
        handleWorkoutNameChange={handleWorkoutNameChange}
        workoutName={workoutName}
        removeWorkoutForm={removeWorkoutForm}
      />

      {exercises.map((exercise) => (
        <Exercises key={exercise.id}>
          {exercises.length > 1 && (
            <CloseIcon
              onClick={() => removeExercise(exercise.id)}
              className="ml-auto mb-2"
            />
          )}
          <Exercises.Input
            type="text"
            exerciseId={exercise.id}
            placeholder="Exercise Name"
            name="name"
            value={exercise.name}
            onChange={(e) => handleExerciseChange(e, exercise.id)}
          />
          <Exercises.Container>
            {exercise.sets.map((set, index) => (
              <Exercises.SetsContainer key={set.id}>
                <Exercises.SetsHeader
                  exerciseId={exercise.id}
                  setNumber={index + 1}
                  setId={set.id}
                  removeSet={exercise.sets.length === 1 ? undefined : removeSet}
                />
                <Exercises.Input
                  id={`reps-${index.toString()}`}
                  label="Reps"
                  name="reps"
                  value={set.reps}
                  exerciseId={exercise.id}
                  onChange={(e) => handleSetChange(e, exercise.id, set.id)}
                  placeholder="Reps"
                  type="number"
                />
                <Exercises.Input
                  id={`weight-${index.toString()}`}
                  type="number"
                  placeholder="Weight"
                  name="weight"
                  value={set.weight}
                  exerciseId={exercise.id}
                  onChange={(e) => handleSetChange(e, exercise.id, set.id)}
                />
              </Exercises.SetsContainer>
            ))}
          </Exercises.Container>
          <button
            type="button"
            onClick={() => addSet(exercise.id)}
            className="mt-4 text-green-600 hover:text-green-800 font-medium"
          >
            Add set
          </button>
        </Exercises>
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
          // disabled={disableCreateAndAddWorkoutBtns()}
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
        >
          Create Workout
        </button>
      </div>
    </Form>
  )
}

export default WorkoutForm
