import React, { ReactNode } from 'react'
import Input from '../form/input'
import CloseIcon from '../close-icon'

type handleExerciseChangeType = (
  e: React.ChangeEvent<HTMLInputElement>,
  exerciseId: string
) => void

type ChildrenType = { children: ReactNode }

interface ExercisesProps {
  children: ReactNode
}

const Exercises: React.FC<ExercisesProps> & {
  Input: React.FC<NameInputProps>
  Container: React.FC<ChildrenType>
  SetsContainer: React.FC<ChildrenType>
  SetsHeader: React.FC<SetsHeaderProps>
} = ({ children }) => {
  return (
    <div className="mb-4 border p-4 rounded-md relative bg-base-200">
      {children}
    </div>
  )
}

interface NameInputProps {
  exerciseId: string
  value: string
  name: string
  type: string
  placeholder: string
  onChange: handleExerciseChangeType
  label?: string
  id?: string
}

const ExerciseInput: React.FC<NameInputProps> = ({
  value,
  name,
  type,
  onChange,
  placeholder,
  id,
  label,
  exerciseId,
}) => {
  return (
    <>
      {label && (
        <label htmlFor={id} className="block mb-1">
          {label}
        </label>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={(e) => onChange(e, exerciseId)}
        className="w-full mb-4"
      />
    </>
  )
}

const Container: React.FC<ChildrenType> = ({ children }) => {
  return <div className="flex flex-wrap gap-4">{children}</div>
}

const SetsContainer: React.FC<ChildrenType> = ({ children }) => {
  return (
    <div className="relative flex-1 p-4 border rounded-md bg-base-100">
      {children}
    </div>
  )
}

interface SetsHeaderProps {
  setNumber: number
  removeSet?: (exerciseId: string, setId: string) => void
  exerciseId: string
  setId: string
}

const SetsHeader: React.FC<SetsHeaderProps> = ({
  setNumber,
  removeSet,
  exerciseId,
  setId,
}) => {
  return (
    <div className="flex justify-between">
      <p className="font-bold mb-2">Set {setNumber}</p>
      {removeSet && <CloseIcon onClick={() => removeSet(exerciseId, setId)} />}
    </div>
  )
}

Exercises.Input = ExerciseInput
Exercises.Container = Container
Exercises.SetsContainer = SetsContainer
Exercises.SetsHeader = SetsHeader

export default Exercises
