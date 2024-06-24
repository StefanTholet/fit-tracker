import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import WorkoutCard from '@/components/workout-card/workout-card'
import { GroupedExerciseSet } from '@/interfaces/workout'
import { Button } from '@/components/ui/button'
import { getPerformanceStatus } from './trainingUtils'
import { buildSearchParams } from './utils'
import { Base64 } from 'js-base64'
import InputGroup from './input-group'

interface SetsProps {
  sets: GroupedExerciseSet[]
  exerciseName: string
  id: string | number
  order: number
  isEditMode?: boolean
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
  isEditMode,
  addSet,
  editSet,
  deleteSet,
  submitSet,
  sets,
  exerciseName,
  id,
  order,
}: SetsProps) => {
  const [exerciseData, setExerciseData] = useState({
    name: exerciseName,
    sets: [...sets.map((set) => structuredClone(set))],
    id,
    order,
  })
  const [selectedSet, setSelectedSet] = useState(0)
  const [showInput, setShowInput] = useState(false)
  const [showAddSetInput, setShowAddSetInput] = useState(false)
  const [newSet, setNewSet] = useState({
    exercise_id: exerciseData.id,
    order: exerciseData.sets.length + 1,
    reps: 1,
    weight: 10,
  })

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
            if (set.order === completedSet.order) {
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

  const toggleAddSetInput = () => setShowAddSetInput((state) => !state)

  const newSetHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e
    const { value, name } = target
    setNewSet((state) => ({ ...state, [name]: value }))
  }

  const addNewSet = async () => {
    await addSet(exerciseData.name, newSet)
  }

  useEffect(() => {
    setExerciseData({ name: exerciseName, sets: [...sets], id, order })
  }, [sets, exerciseName, id, order])

  return (
    <>
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
            className="btn w-full my-5"
          >
            {isEditMode ? 'Save changes' : 'Complete set'}
          </Button>
          {isEditMode && deleteSet && (
            <Button
              onClick={() =>
                deleteSet(
                  exerciseData.sets[selectedSet].exercise_id,
                  exerciseName
                )
              }
              className="bg-red-700 w-full"
            >
              Delete set
            </Button>
          )}
        </div>
      </InputGroup>
      {isEditMode && (
        <>
          <Button onClick={toggleAddSetInput}>Add set</Button>
          {showAddSetInput && <p>Add your new set below</p>}
          <InputGroup
            set={newSet}
            showInput={showAddSetInput}
            divRef={showAddSetRef}
            handleChange={newSetHandleChange}
          >
            <Button onMouseDown={addNewSet}>Save new set</Button>
          </InputGroup>
        </>
      )}
    </>
  )
}

export default Sets
