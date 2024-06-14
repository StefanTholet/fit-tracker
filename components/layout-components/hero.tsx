import Image from 'next/image'
import Link from 'next/link'
import hero from '@/assets/images/hero.jpg'
import { Button } from '../ui/button'
import styles from './layout.module.css'

const Hero = ({ userId }: { userId?: number | string }) => {
  return (
    <div
      className={`min-h-96 bg-gray-800 mb-14 flex items-center justify-center py-10`}
    >
      <div
        className={`${
          userId ? 'w-full justify-center' : ''
        } flex flex-col lg:flex-row-reverse items-center`}
      >
        <div className={styles.imageContainer}>
          <Image
            priority
            src={hero}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
            className="rounded-lg shadow-2xl"
            alt="person lifting weights"
          />
        </div>
        <div className="text-center lg:text-left lg:ml-10 mt-8 lg:mt-0 max-w-lg mr-3">
          <h1 className="text-5xl text-white font-bold">Fit Tracker</h1>
          <p className="py-6 text-white">Where history is written...</p>
          {!userId && (
            <div className="flex justify-center lg:justify-start">
              <Button className="text-white bg-blue-500 hover:bg-blue-700 mr-3">
                <Link href="/signup">Register</Link>
              </Button>
              <Button className="text-white bg-green-500 hover:bg-green-700">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Hero
