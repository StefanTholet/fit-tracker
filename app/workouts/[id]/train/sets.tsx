import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import WorkoutCard from '@/components/workout-card/workout-card'
import { GroupedExerciseSet } from '@/interfaces/workout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getPerformanceStatus } from './trainingUtils'
import { buildSearchParams } from './utils'
import { Base64 } from 'js-base64'

interface SetsProps {
  sets: GroupedExerciseSet[]
  exerciseName: string
  id: string | number
  order: number
  submitSet: (...args: any) => Promise<string | null>
}

const Sets = ({ sets, exerciseName, id, order, submitSet }: SetsProps) => {
  const [exerciseData, setExerciseData] = useState({
    name: exerciseName,
    sets: [...sets],
    id,
    order
  })
  const [selectedSet, setSelectedSet] = useState(0)
  const [showInput, setShowInput] = useState(false)
  const divRef = useRef<HTMLDivElement | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleClickSet = (
    e: React.MouseEvent<HTMLButtonElement>,
    setIndex: number
  ) => {
    e.preventDefault()
    if (setIndex === selectedSet && showInput) {
      setShowInput(false)
      setSelectedSet(0)
      return
    }
    if (setIndex !== selectedSet) {
      setSelectedSet(setIndex)
    }
    setShowInput(true)
    const { current } = divRef
    if (current) {
      current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e
    const { value, name } = target
    setExerciseData((state) => {
      const exercise = { ...state }
      exercise.sets[selectedSet][name] = value
      return { ...exercise }
    })
  }

  const handleSubmit = async () => {
    const currentSet = exerciseData.sets[selectedSet]
    const performanceStatus = getPerformanceStatus(
      sets[selectedSet],
      currentSet
    )
    const id = await submitSet(exerciseData, selectedSet, performanceStatus)
    if (id) {
      setExerciseData((state) => {
        const newState = { ...state }
        newState.sets[selectedSet].performed_exercise_id = id
        newState.sets[selectedSet].performanceStatus = performanceStatus
        return { ...state }
      })
      currentSet.performed_exercise_id = id
      currentSet.performanceStatus = performanceStatus
      const newParams = buildSearchParams(
        searchParams.get('completedSets'),
        pathname,
        exerciseData.name,
        currentSet
      )
      router.replace(newParams, { scroll: false })
      setShowInput(false)
    }
  }

  useEffect(() => {
    const url = searchParams.get('completedSets')
    const decodedUrl = url ? Base64.decode(url) : null

    if (decodedUrl) {
      const completedSetsUrl = decodedUrl
        .split('exercise=')
        .filter((el) => el !== '?' && el !== '')

      completedSetsUrl.forEach((set) => {
        const setData = set.split('=')

        const completedSet = JSON.parse(setData[1])
        setExerciseData((state) => {
          let newState = { ...state }

          newState.sets = newState.sets.map((set) => {
            if (set.exercise_order === completedSet.exercise_order) {
              set.performed_exercise_id = completedSet.performed_exercise_id
              set.performanceStatus = completedSet.performanceStatus
            }
            return set
          })
          return newState
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <WorkoutCard.SetsContainer>
        {sets.map((set: GroupedExerciseSet, index: number) => {
          const isSelected = selectedSet === index && showInput
          return (
            <WorkoutCard.Set
              selected={isSelected}
              onClick={(e) => handleClickSet(e, index)}
              key={index}
              reps={set.reps}
              weight={set.weight}
              performanceStatus={exerciseData?.sets[index]?.performanceStatus}
              variant="current"
            />
          )
        })}
      </WorkoutCard.SetsContainer>
      <div
        ref={divRef}
        className={`flex flex-col gap-4 max-w-48 m-auto ${
          showInput ? 'opacity-100' : 'opacity-0 h-0'
        }`}
      >
        <Label htmlFor="weight">Weight</Label>
        <Input
          className="rounded-md pl-2 border border-solid border-gray-200"
          type="number"
          name="weight"
          id="weight"
          placeholder="weight"
          value={exerciseData.sets[selectedSet]?.weight}
          onChange={handleChange}
        />
        <Label htmlFor="reps">Reps</Label>
        <Input
          className="rounded-md pl-2 border border-solid border-gray-200"
          type="number"
          name="reps"
          id="reps"
          placeholder="reps"
          value={exerciseData.sets[selectedSet]?.reps}
          onChange={handleChange}
        />
        <Button onClick={handleSubmit} className="btn my-5">
          Complete set
        </Button>
      </div>
    </>
  )
}

export default Sets
