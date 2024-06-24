'use client'
import React, { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface WorkoutCardProps {
  children: ReactNode
  variant?: 'previous' | 'current'
  className?: string
  containerClassName?: string
  cardRef?: React.ForwardedRef<HTMLDivElement>
  isEditMode?: boolean // New prop
}

function WorkoutCard({
  children,
  variant = 'current',
  className = '',
  containerClassName = '',
  cardRef = null,
  isEditMode = false // Default value
}: WorkoutCardProps) {
  const variantClassMapper = {
    current: 'bg-white',
    previous: 'bg-gray-800 text-gray-50 dark:bg-gray-50 dark:text-gray-900',
    editMode: 'border border-dashed border-gray-400' // Edit mode styling
  }

  return (
    <div
      ref={cardRef}
      className={`max-w-md mx-auto p-4 space-y-4 rounded-lg shadow-lg ${containerClassName}`}
    >
      <Card
        className={`${variantClassMapper[variant]} ${
          isEditMode ? variantClassMapper.editMode : ''
        } ${className}`}
      >
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
  isEditMode?: boolean // New prop
}

const Header = ({
  titleClassName = '',
  className = '',
  workoutName,
  children
}: HeaderProps) => (
  <CardHeader className={`${className}`}>
    <div className="flex items-center justify-between">
      <CardTitle
        className={`text-xl font-bold text-blue-500 ${titleClassName}`}
      >
        {workoutName}
      </CardTitle>
      {children}
    </div>
  </CardHeader>
)

interface ExercisesProps {
  children?: ReactNode
  isEditMode?: boolean // New prop
}

const Exercises = ({ children, isEditMode = false }: ExercisesProps) => (
  <CardContent>
    <div className={`space-y-4 ${isEditMode ? 'bg-gray-100' : ''}`}>
      {children}
    </div>
  </CardContent>
)

const Exercise = ({
  name,
  onClick,
  className = '',
  children
}: {
  name: string
  onClick?: () => void
  className?: string
  children?: ReactNode
}) => (
  <div className={`bg-gray-100 p-3 rounded-md ${className}`} onClick={onClick}>
    <div className="w-full text-left self-center">{name}</div>
    {children}
  </div>
)

interface SetProps {
  selected?: boolean
  performanceStatus?: 'met' | 'not-met' | 'exceeded'
  onClick?: (...args: any) => void
  reps: string | number
  weight: string | number
  variant?: 'previous' | 'current'
  children?: ReactNode
  isEditMode?: boolean // New prop
}

const SetsContainer = ({
  children,
  isEditMode = false
}: {
  children: ReactNode
  isEditMode?: boolean
}) => (
  <div
    className={`grid grid-cols-3 gap-2 ${
      isEditMode ? 'bg-gray-100 p-2 rounded' : ''
    }`}
  >
    {children}
  </div>
)

const Set = ({
  selected,
  performanceStatus,
  onClick,
  reps,
  weight,
  variant = 'current',
  children,
  isEditMode = false // Default value
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
    },
    editMode: 'border border-dashed border-gray-400' // Edit mode styling
  }

  const selectedClass = 'border-2 border-blue-500'

  return (
    <div
      className={`relative p-2 rounded-md dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 ${
        onClick ? 'cursor-pointer' : ''
      } ${
        performanceStatus
          ? variantClassMapper[variant][performanceStatus]
          : 'bg-gray-200'
      } hover:bg-gray-200 transition-colors duration-200 ${
        selected ? selectedClass : ''
      } ${isEditMode ? variantClassMapper.editMode : ''}`}
      onClick={onClick}
    >
      {children}
      <p className="text-sm text-gray-500 font-medium text-center">
        {reps} reps
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {weight}kg
      </p>
      {performanceStatus && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
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
