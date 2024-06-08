import React from 'react'

export interface SetProps {
  disabled?: boolean
  set: { reps: number | string; weight: number | string }
  exerciseName: string
  exerciseId: string
  setIndex: number
  className?: string
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement>,
    exerciseName: string,
    exerciseId: string,
    setIndex: number
  ) => void
}

const Set = ({
  disabled,
  set,
  onClick,
  exerciseName,
  exerciseId,
  setIndex,
  className
}: SetProps) => {
  return (
    <button
      key={setIndex}
      disabled={disabled}
      onClick={(e) => onClick && onClick(e, exerciseName, exerciseId, setIndex)}
      className={`btn btn-outline btn-sm ${className ? className : ''}`}
    >
      {set.reps} x {set.weight}
    </button>
  )
}

export default Set
