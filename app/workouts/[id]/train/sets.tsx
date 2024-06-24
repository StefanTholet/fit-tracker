import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import WorkoutCard from '@/components/workout-card/workout-card'
import { GroupedExerciseSet } from '@/interfaces/workout'
import { Button } from '@/components/ui/button'
import { getPerformanceStatus } from './trainingUtils'
import { buildSearchParams } from './utils'
import { Base64 } from 'js-base64'
import InputGroup from './input-group'
import FilePenIcon from '@/assets/svg/file-pen-icon'

interface SetsProps {
  sets: GroupedExerciseSet[]
  exerciseName: string
  id: string | number
  order: number
  submitSet: (...args: any) => Promise<string | null>
  addSet: (exerciseName: string, newSet: GroupedExerciseSet) => void
  editSet?: (
    exerciseId: string | number,
    reps: number | string,
    weight: number | string,
    order: number
  ) => Promise<boolean | null>
  deleteSet?: (id: string, exerciseName: string) => Promise<boolean>
}

const Sets = ({
  addSet,
  editSet,
  deleteSet,
  submitSet,
  sets,
  exerciseName,
  id,
  order
}: SetsProps) => {
  const [exerciseData, setExerciseData] = useState({
    name: exerciseName,
    sets: [...sets.map((set) => structuredClone(set))],
    id,
    order
  })
  const [selectedSet, setSelectedSet] = useState(0)
  const [showInput, setShowInput] = useState(false)
  const [showAddSetInput, setShowAddSetInput] = useState(false)
  const [newSet, setNewSet] = useState({
    id: exerciseData.id,
    order: exerciseData.sets.length + 1,
    reps: 1,
    weight: 10
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const divRef = useRef<HTMLDivElement | null>(null)
  const showAddSetRef = useRef<HTMLDivElement | null>(null)

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
    // const { current } = divRef
    // if (current) {
    //   current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    // }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseData])

  const toggleAddSetInput = () => setShowAddSetInput((state) => !state)

  const newSetHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e
    const { value, name } = target
    setNewSet((state) => ({ ...state, [name]: value }))
  }

  const addNewSet = async () => {
    await addSet(exerciseData.name, newSet)
    setShowAddSetInput(false)
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

          newState.sets = [
            ...sets.map((set) => {
              if (set.id === completedSet.id) {
                set.performanceStatus = completedSet.performanceStatus
              }
              return { ...set }
            })
          ]
          return newState
        })
      })
    } else {
      setExerciseData({ name: exerciseName, sets: [...sets], id, order })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sets, exerciseName, id, order])

  return (
    <>
      <WorkoutCard.Exercise
        name={exerciseName}
        className="flex justify-between"
      >
        <Button
          variant="ghost"
          className="p-2"
          onClick={() => setIsEditMode((state) => !state)}
        >
          <FilePenIcon className="h-5 w-5 text-blue-500" />
        </Button>
      </WorkoutCard.Exercise>
      <WorkoutCard.SetsContainer isEditMode={isEditMode}>
        {sets.map((set: GroupedExerciseSet, index: number) => {
          const isSelected = selectedSet === index && showInput
          return (
            <WorkoutCard.Set
              isEditMode={isEditMode}
              selected={isSelected}
              onClick={(e) => handleClickSet(e, index)}
              key={index}
              reps={set.reps}
              weight={set.weight}
              performanceStatus={exerciseData?.sets[index]?.performanceStatus}
              variant="current"
            ></WorkoutCard.Set>
          )
        })}
      </WorkoutCard.SetsContainer>
      <InputGroup
        divRef={divRef}
        handleChange={handleChange}
        set={exerciseData.sets[selectedSet]}
        showInput={showInput}
        title={isEditMode ? 'Edit set' : ''}
      >
        <div className="flex gap-1 justify-center flex-wrap">
          <Button
            onClick={
              isEditMode && editSet
                ? () =>
                    editSet(
                      exerciseData.id,
                      exerciseData.sets[selectedSet].reps,
                      exerciseData.sets[selectedSet].weight,
                      exerciseData.sets[selectedSet].order
                    )
                : handleSubmit
            }
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full bg-blue-500 text-white"
          >
            {isEditMode ? 'Save changes' : 'Complete set'}
          </Button>
          {isEditMode && deleteSet && (
            <Button
              onClick={() =>
                deleteSet(exerciseData.sets[selectedSet].id, exerciseName)
              }
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full bg-red-500 text-white"
            >
              Delete set
            </Button>
          )}
        </div>
      </InputGroup>
      {isEditMode && !showInput && (
        <>
          {
            <Button
              onClick={toggleAddSetInput}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-10 px-4 py-2 w-full text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
            >
              Add set
            </Button>
          }
          {showAddSetInput && <p>Add your new set below</p>}
          <InputGroup
            set={newSet}
            showInput={showAddSetInput}
            divRef={showAddSetRef}
            handleChange={newSetHandleChange}
          >
            <Button
              onMouseDown={addNewSet}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full bg-blue-500 text-white"
            >
              Save new set
            </Button>
          </InputGroup>
        </>
      )}
    </>
  )
}

export default Sets
