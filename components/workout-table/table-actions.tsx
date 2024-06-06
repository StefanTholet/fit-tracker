'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Barbell from '@/assets/svg/barbell'

interface TableActionsProps {
  workoutId: number
}
const TableActions = ({ workoutId }: TableActionsProps) => {
  const router = useRouter()

  const startTrainingSession = (workoutId: number) => {
    router.push(`/training-session?workoutId=${workoutId}`)
  }
  return (
    <>
      <button className="btn btn-sm btn-secondary" title="Edit" disabled>
        {/* <FaEdit /> */}
      </button>
      <button className="btn btn-sm btn-error" title="Delete" disabled>
        {/* <FaTrashAlt /> */}
      </button>
      <button
        className="btn btn-sm"
        title="Start Training"
        onClick={() => startTrainingSession(workoutId)}
      ></button>
    </>
  )
}

export default TableActions
