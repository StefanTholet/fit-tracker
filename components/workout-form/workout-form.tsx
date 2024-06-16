'use client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AddWorkoutInitialStateType } from '@/interfaces/workout'
import useWorkoutForm from '@/hooks/useWorkoutForm'
import { Workout } from '@/interfaces/workout'
import { addWorkout } from '@/server-actions/workout-actions'
import CloseIcon from '@/assets/svg/close-icon'
import useLoader from '@/hooks/useLoader'
import { useToast } from '../ui/use-toast'

interface WorkoutFormProps {
  removeWorkoutForm?: () => void
  title: string
  initialState?: AddWorkoutInitialStateType
  userId: number
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
    removeSet
  } = useWorkoutForm()

  const { toast } = useToast()

  const handleSubmit = async (userId: number) => {
    const workout: Workout = {
      name: workoutName,
      exercises
    }
    try {
      setIsLoading(true)
      await addWorkout(workout, userId, 'planned')
      toast({
        title: workoutName,
        description: 'has been added to your workouts list.',
        variant: 'success'
      })
    } catch (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const { ButtonLoader, isLoading, setIsLoading } = useLoader(false)

  return (
    <>
      <div className="relative w-full max-w-2xl mx-auto space-y-6 bg-gray-100 p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:text-gray-50">
        <CloseIcon
          className="ml-auto cursor-pointer"
          onClick={removeWorkoutForm}
        />
        <div className="space-y-2">
          <Label
            htmlFor="workout-name"
            className="text-gray-700 dark:text-gray-300"
          >
            {workoutName}
          </Label>
          <Input
            id="workout-name"
            value={workoutName}
            onChange={(e) => handleWorkoutNameChange(e.target.value)}
            placeholder="Enter workout name"
            className="bg-white dark:bg-gray-700 dark:text-gray-50 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Exercises
            </h3>
            <Button
              onClick={addExercise}
              className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Add Exercise
            </Button>
          </div>
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="space-y-4 bg-white p-4 rounded-lg shadow-md dark:bg-gray-700 dark:text-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Input
                    value={exercise.name}
                    onChange={(e) =>
                      handleExerciseChange(
                        e.target.name,
                        e.target.value,
                        exercise.id
                      )
                    }
                    name="name"
                    placeholder="Exercise Name"
                    className="bg-white dark:bg-gray-600 dark:text-gray-50 border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button
                    variant="outline"
                    onClick={() => removeExercise(exercise.id)}
                    className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    Remove
                  </Button>
                </div>
                <div className="space-y-4">
                  {exercise.sets.map((set) => (
                    <div
                      key={set.id}
                      className="grid grid-cols-3 items-center gap-4"
                    >
                      <Input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                          handleSetChange(
                            e.target.name,
                            e.target.value,
                            exercise.id,
                            set.id
                          )
                        }
                        name="reps"
                        placeholder="Reps"
                        className="bg-white dark:bg-gray-600 dark:text-gray-50 border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Input
                        type="number"
                        value={set.weight}
                        onChange={(e) =>
                          handleSetChange(
                            e.target.name,
                            e.target.value,
                            exercise.id,
                            set.id
                          )
                        }
                        name="weight"
                        placeholder="Weight"
                        className="bg-white dark:bg-gray-600 dark:text-gray-50 border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Button
                        variant="outline"
                        onClick={() => removeSet(exercise.id, set.id)}
                        className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-700 dark:hover:bg-red-800"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addSet(exercise.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Add Set
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button
          onMouseDown={() => handleSubmit(userId)}
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {isLoading ? <ButtonLoader /> : 'Save Workout'}
        </Button>
      </div>
    </>
  )
}

export default WorkoutForm
