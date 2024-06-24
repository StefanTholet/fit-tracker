import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GroupedExerciseSet } from '@/interfaces/workout'

interface InputGroupProps {
  set: GroupedExerciseSet
  divRef?: React.ForwardedRef<HTMLDivElement>
  showInput?: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  topInputs?: React.ReactNode
  children?: React.ReactNode
  title?: string
  className?: string
}

const InputGroup = ({
  set,
  divRef,
  showInput = true,
  handleChange,
  title,
  topInputs,
  className,
  children
}: InputGroupProps) => {
  return (
    <div
      className={`flex flex-col gap-4 mb-5  m-auto relative overflow-hidden transition-all duration-300 ease-in-out ${className} ${
        showInput ? 'max-h-[1000px] z-10' : 'max-h-0 z-[-50]'
      }`}
    >
      {title && <h3 className="font-bold">{title}</h3>}
      {topInputs}
      <Label
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        htmlFor="reps"
      >
        Reps
      </Label>
      <Input
        className="rounded-md pl-2 border border-solid border-gray-200"
        type="number"
        name="reps"
        id="reps"
        placeholder="reps"
        value={set?.reps}
        onChange={handleChange}
      />
      <Label htmlFor="weight">Weight</Label>
      <Input
        className="rounded-md pl-2 border border-solid border-gray-200"
        type="number"
        name="weight"
        id="weight"
        placeholder="weight"
        value={set?.weight}
        onChange={handleChange}
      />
      {children}
    </div>
  )
}

export default InputGroup
