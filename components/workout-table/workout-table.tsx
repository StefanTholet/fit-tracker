import React from 'react'

import { Exercise } from '@/interfaces/workout'
import TableActions from './table-actions'

interface Workouts {
  workout_name: string
  workout_id: number
  created_on: string
  exercises: Exercise[]
}

interface WorkoutTableProps {
  workouts: Workouts[]
}

const WorkoutTable = ({ workouts }: WorkoutTableProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }
    return new Date(dateString).toLocaleString(undefined, options)
  }

  return (
    <div className="container mx-auto p-4">
      {workouts.map((plan) => (
        <div key={plan.workout_id} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{plan.workout_name}</h2>
          <div className="overflow-x-auto">
            <table className="table w-full border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Created On</th>
                  <th className="p-2">Exercise</th>
                  <th className="p-2">Sets</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plan.exercises.map((exercise, exerciseIndex) => (
                  <tr key={exercise.id} className="cursor-pointer">
                    <td className="p-2">{formatDate(plan.created_on)}</td>
                    <td className="p-2">{exercise.name}</td>
                    <td className="p-2">
                      {exercise.sets.map((set, index) => (
                        <div key={index} className="mb-1">
                          {`Reps: ${set.reps}, Weight: ${set.weight}kg`}
                        </div>
                      ))}
                    </td>
                    {exerciseIndex === 0 && (
                      <td
                        className="p-2 border border-gray-200 rounded-lg hover:bg-none"
                        rowSpan={plan.exercises.length + 1}
                      >
                        <div className="flex justify-center space-x-2">
                          <TableActions workoutId={plan.workout_id} />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WorkoutTable
