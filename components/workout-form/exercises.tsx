import React from 'react'
import { Exercise } from '@/interfaces/exercise'

interface ExercisesProps {
  index: number
  exercise: Exercise
  handleExerciseChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void
  removeExercise: (index: number) => void
}

const Exercises: React.FC<ExercisesProps> = ({
  exercise,
  handleExerciseChange,
  removeExercise,
  index
}) => {
  return (
    <div className="mb-4 border p-4 rounded-md">
      <input
        type="text"
        placeholder="Exercise Name"
        name="name"
        value={exercise.name}
        onChange={(e) => handleExerciseChange(e, index)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
      />
      <div className="flex justify-between">
        <input
          type="number"
          placeholder="Sets"
          name="sets"
          value={exercise.sets}
          onChange={(e) => handleExerciseChange(e, index)}
          className="w-1/4 mr-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="number"
          placeholder="Reps"
          name="reps"
          value={exercise.reps}
          onChange={(e) => handleExerciseChange(e, index)}
          className="w-1/4 mr-2 px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Weight"
          name="weight"
          value={exercise.weight}
          onChange={(e) => handleExerciseChange(e, index)}
          className="w-1/4 px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="button"
          onClick={() => removeExercise(index)}
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default Exercises
