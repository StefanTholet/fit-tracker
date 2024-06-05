import Button from '../button'
import Image from 'next/image'
import Link from 'next/link'
import hero from '@/assets/images/hero.jpg'
const Hero = ({ userId }: { userId?: number | string }) => {
  return (
    <div className="bg-gray-100 py-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Welcome to Fit Tracker
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 mb-6">
            Your ultimate companion for workout and fitness tracking.
          </p>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <Link
              href="/signup"
              className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300 mb-4 md:mb-0"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400 transition duration-300"
            >
              Login
            </Link>
          </div>
        </div>
        <div className="flex-1 mt-10 md:mt-0">
          <Image
            src={hero}
            alt="Person Deadlifting"
            width={600}
            height={400}
            className="w-full h-auto rounded-lganimate-slide-in"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
