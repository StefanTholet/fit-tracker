import Button from './button'
import Image from 'next/image'
import Link from 'next/link'
import hero from '../assets/images/hero.jpg'
const Hero = () => {
  return (
    <div className="hero min-h-96 bg-neutral mb-14">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <Image
          src={hero}
          sizes="30vw"
          className="w-full max-w-sm  rounded-lg shadow-2xl"
          alt="person lifting weights"
        />
        <div>
          <h1 className="text-5xl text-white font-bold">Fit Tracker</h1>
          <p className="py-6 text-white">Where history is written...</p>
          <Button className=" text-white" type="primary">
            <Link href="/register">Register</Link>
          </Button>
          <Button className="ml-3 btn  text-white" type="primary-2">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Hero
