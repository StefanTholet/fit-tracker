import React from 'react'
import { Input } from '@/components/ui/input'
import TrashIcon from '@/assets/svg/trash-icon'
import { Set } from '@/interfaces/workout'

interface SetInputsProps {
  set: Set
  exerciseId: string
  handleSetChange: (
    name: string,
    value: string,
    exerciseId: string,
    setId: string
  ) => void
  removeSet: (exerciseId: string, setId: string) => void
}

const SetInputs = ({
  set,
  exerciseId,
  handleSetChange,
  removeSet,
}: SetInputsProps) => {
  return (
    <div key={set.id} className="grid grid-cols-3 items-center gap-4 ">
      <Input
        type="number"
        value={set.reps}
        onChange={(e) =>
          handleSetChange(e.target.name, e.target.value, exerciseId, set.id)
        }
        name="reps"
        placeholder="Reps"
        className="bg-white dark:bg-gray-600 dark:text-gray-50 border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <Input
        type="number"
        value={set.weight}
        onChange={(e) =>
          handleSetChange(e.target.name, e.target.value, exerciseId, set.id)
        }
        name="weight"
        placeholder="Weight"
        className="bg-white dark:bg-gray-600 dark:text-gray-50 border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <span
        className="self-center cursor-pointer max-w-fit"
        onClick={() => removeSet(exerciseId, set.id)}
        title="Remove set"
      >
        <TrashIcon className={'hover:scale-110'} />
      </span>
    </div>
  )
}

export default SetInputs
