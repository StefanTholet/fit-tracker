import React, { ReactNode } from 'react'

const ExerciseList = ({ children }: { children: ReactNode }) => {
  return <ol className="list-decimal pl-6 mt-2">{children}</ol>
}

const Item = ({ name, children }: { name: string; children: ReactNode }) => {
  return (
    <li className="border-b border-gray-300 py-2">
      <h4 className="text-lg">{name}</h4>
      {children}
    </li>
  )
}

const Container = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-wrap gap-2 mt-2">{children} </div>
}

interface SetBtn {
  reps: number
  weight: number
  onClick?: () => any
  className?: string
  children?: ReactNode
}

const SetBtn = ({ reps, weight, onClick, className, children }: SetBtn) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-outline btn-sm ${className && className}`}
    >
      {reps} x {weight}
      {children}
    </button>
  )
}

ExerciseList.Item = Item
ExerciseList.Container = Container
export default ExerciseList
