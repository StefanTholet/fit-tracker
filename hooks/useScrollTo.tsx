'use client'
import React, { useRef, useEffect, MutableRefObject } from 'react'

const useScrollTo = <T extends Element>(dependencies: any[] = []) => {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return ref
}

export default useScrollTo
