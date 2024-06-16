'use client'
import { useState } from 'react'
import Loader from '@/components/layout-components/loader'
import { ReloadIcon } from '@radix-ui/react-icons'

const ButtonLoader = () => <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />

const useLoader = (initialLoadingState: boolean = true) => {
  const [isLoading, setIsLoading] = useState(initialLoadingState)

  return { isLoading, setIsLoading, Loader, ButtonLoader }
}

export default useLoader
