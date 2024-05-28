import { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="flex justify-center  min-h-screen bg-gray-100 pt-14">
      {children}
    </div>
  )
}

export default Container
