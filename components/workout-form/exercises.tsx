import React from 'react'
import Input from '../input'
import CloseIcon from '../close-icon'
import { Exercise } from '@/interfaces/exercise'

interface ExercisesProps {
  index: number
  exercise: Exercise
  handleExerciseChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void
  removeExercise: (index: number) => void
  handleSetChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    exerciseId: string,
    setId: string
  ) => void
  addSet: (exerciseId: string) => void
  removeSet: (exerciseId: string, setId: string) => void
}

const Exercises: React.FC<ExercisesProps> = ({
  exercise,
  handleExerciseChange,
  removeExercise,
  addSet,
  removeSet,
  handleSetChange,
  index,
}) => {
  return (
    <div className="mb-4 border p-4 rounded-md relative bg-base-200">
      <CloseIcon
        onClick={() => removeExercise(index)}
        className="ml-auto mb-2"
      />
      <Input
        type="text"
        placeholder="Exercise Name"
        name="name"
        value={exercise.name}
        onChange={(e) => handleExerciseChange(e, index)}
        className="w-full mb-4"
      />
      <div className="flex flex-wrap gap-4">
        {exercise.sets.map((set, index) => (
          <div
            key={set.id}
            className="relative flex-1 p-4 border rounded-md bg-base-100"
          >
            <div className="flex justify-between">
              <p className="font-bold mb-2">Set {index + 1}</p>
              {exercise.sets.length > 1 && (
                <CloseIcon onClick={() => removeSet(exercise.id, set.id)} />
              )}
            </div>
            <label htmlFor={`reps-${index.toString()}`} className="block mb-1">
              Reps
            </label>
            <Input
              id={`reps-${index.toString()}`}
              type="number"
              placeholder="Reps"
              name="reps"
              value={set.reps}
              onChange={(e) => handleSetChange(e, exercise.id, set.id)}
              className="mb-4"
            />
            <label
              htmlFor={`weight-${index.toString()}`}
              className="block mb-1"
            >
              Weight
            </label>
            <Input
              id={`weight-${index.toString()}`}
              type="text"
              placeholder="Weight"
              name="weight"
              value={set.weight}
              onChange={(e) => handleSetChange(e, exercise.id, set.id)}
              className="mb-4"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => addSet(exercise.id)}
        className="mt-4 text-green-600 hover:text-green-800 font-medium"
      >
        Add set
      </button>
    </div>
  )
}

export default Exercises
