'use client'

import React, { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import TrashIcon from '@/assets/svg/trash-icon'
import PlusIcon from '@/assets/svg/plus-icon'
import PencilIcon from '@/assets/svg/pencil-icon'

function WorkoutCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 bg-gray-50 p-6 rounded-lg shadow-lg dark:bg-gray-900 dark:text-gray-50">
      <Card
        className={`${
          // selectedWorkout === index
          // ? 'bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900'
          // : 'bg-white dark:bg-gray-800'
          'bg-white dark:bg-gray-800'
        }`}
      >
        {children}
      </Card>
    </div>
  )
}

interface HeaderProps {
  workoutName: string
  children?: ReactNode
}

const Header = ({ workoutName, children }: HeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>{workoutName}</CardTitle>
        {children}
      </div>
    </CardHeader>
  )
}

interface ExercisesProps {
  children?: ReactNode
}

const Exercises = ({ children }: ExercisesProps) => {
  return (
    <CardContent>
      <div className="space-y-4">{children}</div>
    </CardContent>
  )
}

const Exercise = ({
  name,
  onClick,
  children
}: {
  name: string
  onClick?: () => void
  children?: ReactNode
}) => {
  return (
    <div className={`space-y-2`} onClick={onClick}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{name}</h3>
        {children}
      </div>
    </div>
  )
}

interface SetProps {
  selected?: boolean
  performanceStatus?: 'met' | 'not-met' | 'exceeded'
  onClick?: void
  reps: string | number
  weight: string | number
}

const SetsContainer = ({ children }: { children: ReactNode }) => {
  return <div className="grid grid-cols-3 gap-2">{children}</div>
}

const Set = ({
  selected,
  performanceStatus,
  onClick,
  reps,
  weight
}: SetProps) => {
  const performanceClassesMapper = {
    met: 'bg-blue-100 dark:bg-blue-900',
    exceeded: 'bg-green-100 dark:bg-green-900',
    'not-met': 'bg-red-100 dark:bg-red-900'
  }
  // bg-gray-200 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700
  return (
    <div
      className={`p-2 rounded-md ${onClick ? 'cursor-pointer' : ''} ${
        selected
          ? 'bg-gray-200 dark:bg-gray-700'
          : performanceStatus
          ? performanceClassesMapper[performanceStatus]
          : 'bg-gray-200 dark:bg-gray-700'
      } hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`}
      onClick={() => onClick}
    >
      <p className="text-sm font-medium">{reps} reps</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{weight}</p>
    </div>
  )
}

WorkoutCard.Header = Header
WorkoutCard.Exercises = Exercises
WorkoutCard.Exercise = Exercise
WorkoutCard.SetsContainer = SetsContainer
WorkoutCard.Set = Set

export default WorkoutCard

//edit
// {
//   selectedExercise === exerciseIndex && selectedSet !== null && (
//     <div className="grid grid-cols-2 gap-4">
//       <div className="space-y-2">
//         <Label htmlFor={`reps-${exerciseIndex}-${selectedSet}`}>Reps</Label>
//         <Input
//           id={`reps-${exerciseIndex}-${selectedSet}`}
//           type="number"
//           defaultValue={
//             workouts[selectedWorkout].exercises[selectedExercise].sets[
//               selectedSet
//             ].reps
//           }
//           onChange={(e) => {
//             const updatedSet = {
//               ...workouts[selectedWorkout].exercises[selectedExercise].sets[
//                 selectedSet
//               ],
//               reps: parseInt(e.target.value)
//             }
//             handleSetUpdate(selectedSet, updatedSet)
//           }}
//         />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor={`weight-${exerciseIndex}-${selectedSet}`}>Weight</Label>
//         <Input
//           id={`weight-${exerciseIndex}-${selectedSet}`}
//           type="number"
//           defaultValue={
//             workouts[selectedWorkout].exercises[selectedExercise].sets[
//               selectedSet
//             ].weight
//           }
//           onChange={(e) => {
//             const updatedSet = {
//               ...workouts[selectedWorkout].exercises[selectedExercise].sets[
//                 selectedSet
//               ],
//               weight: parseInt(e.target.value)
//             }
//             handleSetUpdate(selectedSet, updatedSet)
//           }}
//         />
//       </div>
//       <div className="col-span-2 space-y-2">
//         <Label htmlFor={`performance-${exerciseIndex}-${selectedSet}`}>
//           Performance
//         </Label>
//         <RadioGroup
//           id={`performance-${exerciseIndex}-${selectedSet}`}
//           defaultValue={
//             workouts[selectedWorkout].exercises[selectedExercise].sets[
//               selectedSet
//             ].performanceStatus
//           }
//           onValueChange={(value) => {
//             const updatedSet = {
//               ...workouts[selectedWorkout].exercises[selectedExercise].sets[
//                 selectedSet
//               ],
//               performanceStatus: value
//             }
//             handleSetUpdate(selectedSet, updatedSet)
//           }}
//           className="flex items-center gap-2"
//         >
//           <Label
//             htmlFor={`performance-met-${exerciseIndex}-${selectedSet}`}
//             className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100 dark:[&:has(:checked)]:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
//           >
//             <RadioGroupItem
//               id={`performance-met-${exerciseIndex}-${selectedSet}`}
//               value="met"
//             />
//             Met
//           </Label>
//           <Label
//             htmlFor={`performance-not-met-${exerciseIndex}-${selectedSet}`}
//             className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&"
//           />
//         </RadioGroup>
//       </div>
//     </div>
//   )
// }
