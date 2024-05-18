import React, { ChangeEvent } from 'react'
import Button from '../button'
import CloseIcon from '../close-icon'
interface FormHeaderProps {
  workoutName: string
  handleWorkoutNameChange: (event: ChangeEvent<HTMLInputElement>) => void
  removeWorkoutForm: () => void
}

const FormHeader: React.FC<FormHeaderProps> = ({
  workoutName,
  handleWorkoutNameChange,
  removeWorkoutForm
}: FormHeaderProps) => {
  return (
    <>
      <button className="block ml-auto">
        <CloseIcon onClick={removeWorkoutForm} />
      </button>
      <h2 className="text-2xl font-bold mb-4">Create Workout</h2>
      <div className="mb-4">
        <label
          htmlFor="workoutName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Workout Name
        </label>
        <input
          type="text"
          id="workoutName"
          value={workoutName}
          onChange={handleWorkoutNameChange}
          placeholder="Enter workout name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          required
        />
      </div>
    </>
  )
}

export default FormHeader
