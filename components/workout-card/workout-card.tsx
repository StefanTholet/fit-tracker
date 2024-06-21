'use client'
import React, { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface WorkoutCardProps {
  children: ReactNode
  variant?: 'previous' | 'current'
  className?: string
  containerClassName?: string
  cardRef?: React.ForwardedRef<HTMLDivElement>
}

function WorkoutCard({
  children,
  variant = 'current',
  className = '',
  containerClassName = '',
  cardRef = null
}: WorkoutCardProps) {
  const variantClassMapper = {
    current: 'bg-white',
    previous: 'bg-gray-800 text-gray-50 dark:bg-gray-50 dark:text-gray-900'
  }

  return (
    <div
      ref={cardRef}
      className={`w-full max-w-4xl mx-auto space-y-8 p-6 rounded-lg shadow-lg ${containerClassName}`}
    >
      <Card className={`${variantClassMapper[variant]} ${className}`}>
        {children}
      </Card>
    </div>
  )
}

interface HeaderProps {
  workoutName: string
  children?: ReactNode
  className?: string
  titleClassName?: string
}

const Header = ({
  titleClassName = '',
  className = '',
  workoutName,
  children
}: HeaderProps) => (
  <CardHeader className={`${className}`}>
    <div className="flex items-center justify-between">
      <CardTitle className={titleClassName}>{workoutName}</CardTitle>
      {children}
    </div>
  </CardHeader>
)

interface ExercisesProps {
  children?: ReactNode
}

const Exercises = ({ children }: ExercisesProps) => (
  <CardContent>
    <div className="space-y-4">{children}</div>
  </CardContent>
)

const Exercise = ({
  name,
  onClick,
  children
}: {
  name: string
  onClick?: () => void
  children?: ReactNode
}) => (
  <div className="space-y-2" onClick={onClick}>
    <div className="flex items-center justify-between">
      <h3 className="font-medium">{name}</h3>
      {children}
    </div>
  </div>
)

interface SetProps {
  selected?: boolean
  performanceStatus?: 'met' | 'not-met' | 'exceeded'
  onClick?: (...args: any) => void
  reps: string | number
  weight: string | number
  variant?: 'previous' | 'current'
}

const SetsContainer = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-3 gap-2">{children}</div>
)

const Set = ({
  selected,
  performanceStatus,
  onClick,
  reps,
  weight,
  variant = 'current'
}: SetProps) => {
  const variantClassMapper = {
    current: {
      met: 'bg-blue-100 text-white',
      exceeded: 'bg-green-100 text-white',
      'not-met': 'bg-red-100 text-white'
    },
    previous: {
      met: 'bg-green-300 text-white',
      exceeded: 'bg-green-400 text-white',
      'not-met': 'bg-pink-300 text-white'
    }
  }

  const selectedClass = 'border-2 border-blue-500'

  return (
    <div
      className={`p-2 rounded-md dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 ${
        onClick ? 'cursor-pointer' : ''
      } ${
        performanceStatus
          ? variantClassMapper[variant][performanceStatus]
          : 'bg-gray-200'
      } hover:bg-gray-200 transition-colors duration-200 ${
        selected ? selectedClass : ''
      }`}
      onClick={onClick}
    >
      <p className="text-sm text-gray-500 font-medium">{reps} reps</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{weight}</p>
      {performanceStatus && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {performanceStatus}
        </p>
      )}
    </div>
  )
}

WorkoutCard.Header = Header
WorkoutCard.Exercises = Exercises
WorkoutCard.Exercise = Exercise
WorkoutCard.SetsContainer = SetsContainer
WorkoutCard.Set = Set

export default WorkoutCard
