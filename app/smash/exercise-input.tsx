import { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import TrashIcon from '@/assets/svg/trash-icon'
import { Exercise } from '@/interfaces/workout'

interface ExerciseInputProps {
  exercise: Exercise
  handleExerciseChange: (
    name: string,
    value: string,
    exerciseId: string
  ) => void
  children?: ReactNode
}

const ExerciseInput = ({
  exercise,
  handleExerciseChange,
  children,
}: ExerciseInputProps) => {
  return (
    <div key={exercise.id} className="flex flex-col gap-4 justify-start mt-8">
      <Label htmlFor={exercise.id}>Exercise name</Label>
      <div className="flex gap-3">
        <Input
          id={exercise.id}
          value={exercise.name}
          onChange={(e) =>
            handleExerciseChange(e.target.name, e.target.value, exercise.id)
          }
          name="name"
          placeholder="Exercise Name"
          className="bg-white dark:bg-gray-600 dark:text-gray-50 border-gray-300 dark:border-gray-500 focus:ring-2"
        />
        {children}
      </div>
    </div>
  )
}

export default ExerciseInput
