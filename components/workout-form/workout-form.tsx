import useWorkoutForm from '@/hooks/useWorkoutForm'

import Form from '../form/form'
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

  return (
    <>
      <Form onSubmit={() => handleSubmit(userId)}>
        <Form.Header title="Create workout" closeForm={removeWorkoutForm}>
          <Form.FormControl label="Workout name">
            <Form.Input
              type="text"
              name="workoutName"
              value={workoutName}
              placeholder="Enter workout name"
              onChange={handleWorkoutNameChange}
            />
          </Form.FormControl>
        </Form.Header>

        {exercises.map((exercise) => (
          <Form.Row key={exercise.id}>
            {exercises.length > 1 && (
              <CloseIcon
                onClick={() => removeExercise(exercise.id)}
                className="ml-auto mb-2"
              />
            )}
            <Form.FormControl label="Exercise name">
              <Form.Input
                className="mb-3"
                type="text"
                placeholder="Exercise Name"
                name="name"
                value={exercise.name}
                onChange={(e) => handleExerciseChange(e, exercise.id)}
              />
            </Form.FormControl>

            <Form.Container>
              {exercise.sets.map((set, index) => (
                <Form.Row key={set.id}>
                  <Form.SubHeader subTitle={`Set ${index + 1}`}>
                    <CloseIcon onClick={() => removeSet(exercise.id, set.id)} />{' '}
                  </Form.SubHeader>
                  <Form.FormControl label="Reps">
                    <Form.Input
                      rest={{ min: '1' }}
                      id={`reps-${index.toString()}`}
                      name="reps"
                      value={set.reps}
                      onChange={(e) => handleSetChange(e, exercise.id, set.id)}
                      placeholder="Reps"
                      type="number"
                    />
                  </Form.FormControl>
                  <Form.FormControl label="weight">
                    <Form.Input
                      rest={{ min: '1' }}
                      id={`weight-${index.toString()}`}
                      type="number"
                      placeholder="Weight"
                      name="weight"
                      value={set.weight}
                      onChange={(e) => handleSetChange(e, exercise.id, set.id)}
                    />
                  </Form.FormControl>
                </Form.Row>
              ))}
            </Form.Container>
            <button
              type="button"
              onClick={() => addSet(exercise.id)}
              className="mt-4 text-green-600 hover:text-green-800 font-medium"
            >
              Add set
            </button>
          </Form.Row>
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
    </>
  )
}

export default WorkoutForm
