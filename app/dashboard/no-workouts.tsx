// components/NoWorkouts.js

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const NoWorkouts = () => {
  return (
    <div className="flex flex-col items-center  bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        You don&apos;t have any workouts yet.
      </h1>
      <div className="flex flex-col items-center sm:flex-row gap-4">
        <Link href="/add-workouts" passHref>
          <Button className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700">
            Create Workouts
          </Button>
        </Link>
        <p className="text-center">or</p>
        <Link href="/smash" passHref>
          <Button className="px-6 py-3 text-white bg-green-600 hover:bg-green-700">
            Start a Training Session
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NoWorkouts
