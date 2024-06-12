import React from 'react'
import FreestyleTraining from './freestyle-training'
import { getSession } from '@/server-actions/auth-actions'
import { redirect } from 'next/navigation'
const page = async () => {
  const { userId } = await getSession()

  if (!userId) {
    redirect('/')
  }
  return (
    <div>
      <h1 className="text-center self-start font-semibold leading-none tracking-tight text-xl mb-8">
        Create and log your workout on the go
      </h1>
      <FreestyleTraining userId={userId} />
    </div>
  )
}

export default page
