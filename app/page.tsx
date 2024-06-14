import { getSession } from '@/server-actions/auth-actions'
import CalendarIcon from '@/assets/svg/calendar-icon'
import ClipboardCheckIcon from '@/assets/svg/clipboard-check-icon'
import ClipboardIcon from '@/assets/svg/clipboard-icon'
import MailsIcon from '@/assets/svg/mails-icon'
import LayoutDashboardIcon from '@/assets/svg/layout-dashboard-icon'
import GitGraphIcon from '@/assets/svg/git-graphic-icon'

import Link from 'next/link'

export default async function Home() {
  const { userId } = await getSession()
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full pb-16">
          <div className="container grid gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Take Control of Your Fitness with Fit Tracker
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Fit Tracker is your ultimate fitness companion. Create
                personalized workout plans, log your progress, and access a
                comprehensive dashboard to track your fitness journey.
              </p>
              {!userId ? (
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/signup"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#2ecc71] px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-[#27ae60] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2ecc71] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#2ecc71] dark:text-gray-900 dark:hover:bg-[#27ae60]/90 dark:focus-visible:ring-[#2ecc71]"
                    prefetch={false}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex h-10 items-center justify-center rounded-md border  border-[#2ecc71] bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-[#2ecc71] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2ecc71] disabled:pointer-events-none disabled:opacity-50 dark:border-[#2ecc71] dark:border-[#2ecc71] dark:bg-gray-950 dark:hover:bg-[#2ecc71]/90 dark:hover:text-gray-50 dark:focus-visible:ring-[#2ecc71]"
                    prefetch={false}
                  >
                    Log In
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Fit Tracker offers a comprehensive set of features to help you
                  achieve your fitness goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <ClipboardIcon className="h-6 w-6 text-[#2ecc71]" />
                  <h3 className="text-xl font-bold">Workout Plans</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create personalized workout plans tailored to your fitness
                  level and goals.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <ClipboardCheckIcon className="h-6 w-6 text-[#2ecc71]" />
                  <h3 className="text-xl font-bold">Workout Tracking</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Log your workout results and progress to stay motivated and on
                  track.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <LayoutDashboardIcon className="h-6 w-6 text-[#2ecc71]" />
                  <h3 className="text-xl font-bold">Fitness Dashboard</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Access a comprehensive dashboard to view your workout history
                  and progress.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <GitGraphIcon className="h-6 w-6 text-[#2ecc71]" />
                  <h3 className="text-xl font-bold">Workout Analytics</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Analyze your workout data with detailed graphs and charts to
                  optimize your routine.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-6 w-6 text-[#2ecc71]" />
                  <h3 className="text-xl font-bold">Workout Scheduling</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Schedule your workouts and receive reminders to stay on top of
                  your fitness routine.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <MailsIcon className="h-6 w-6 text-[#2ecc71]" />
                  <h3 className="text-xl font-bold">Personalized Insights</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get personalized recommendations and insights to help you
                  reach your fitness goals.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
