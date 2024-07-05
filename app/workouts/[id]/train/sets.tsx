import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import WorkoutCard from '@/components/workout-card/workout-card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { getPerformanceStatus } from './trainingUtils'

import { buildSearchParams } from './utils'
import { Base64 } from 'js-base64'
import { GroupedExerciseSet } from '@/interfaces/workout'
import { Exercise } from './training'
import InputGroup from './input-group'
import FilePenIcon from '@/assets/svg/file-pen-icon'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  addExercise,
  editPlannedSet,
  editPerformedSet,
  deletePlannedSet,
  addPerformedExercise
} from '@/server-actions/workout-actions'

interface SetsProps {
  sets: GroupedExerciseSet[]
  exerciseName: string
  id: string | number
  order: number
  userId: string | number
  workoutId: number
}

export interface CompletedSets {
  [key: string]: Exercise
}

const Sets = ({
  userId,
  workoutId,
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
  const [editCheckboxes, setEditCheckboxes] = useState({
    plannedSet: false,
    performedSet: false
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const divRef = useRef<HTMLDivElement | null>(null)
  const showAddSetRef = useRef<HTMLDivElement | null>(null)

  const { toast } = useToast()
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

  const getCompletedSets = () => {
    const url = searchParams.get('completedSets')
    const decodedUrl = url ? Base64.decode(url) : null

    if (decodedUrl) {
      const exercises = decodedUrl
        .split('exercise=')
        .filter((el) => el !== '?' && el !== '')

      const completedSets: CompletedSets = {}
      exercises.forEach((set) => {
        const setStringArray = set.split('=')
        const exerciseName = setStringArray[0]
        const setData = JSON.parse(setStringArray[1])
        completedSets[exerciseName] = setData
      })
      return completedSets
    }
    return {}
  }

  const submitSet = async (
    selectedSet: number,
    performanceStatus: 'met' | 'not-met' | 'exceeded'
  ) => {
    const currentSet = { ...exerciseData.sets[selectedSet] }
    const id = currentSet.performed_exercise_id || uuidv4()

    const requestData = {
      id: id,
      name: exerciseName,
      reps: currentSet.reps,
      weight: currentSet.weight,
      performanceStatus,
      exerciseId: currentSet.id,
      userId,
      workoutId,
      order: Object.keys(getCompletedSets()).length
    }

    try {
      const result = await addPerformedExercise(requestData)
      toast({
        title: `${exerciseData.name}`,
        description: `Set ${selectedSet + 1} successfully ${result}!`,
        variant: 'success'
      })
      return id
    } catch (error) {
      console.log(error)
      toast({
        title: 'Something went wrong...',
        description: 'Unable to save your completed set',
        variant: 'destructive'
      })
      return null
    }
  }

  const handleSubmit = async () => {
    const currentSet = exerciseData.sets[selectedSet]
    const performanceStatus = getPerformanceStatus(
      sets[selectedSet],
      currentSet
    )
    const id = await submitSet(selectedSet, performanceStatus)

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

  const toggleAddSetInput = () => setShowAddSetInput((state) => !state)

  const newSetHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e
    const { value, name } = target
    setNewSet((state) => ({ ...state, [name]: value }))
  }

  const handleEditCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setEditCheckboxes((state) => ({ ...state, [name]: checked }))
  }

  const addNewSet = async () => {
    try {
      const createdSet = await addExercise(
        workoutId,
        userId,
        exerciseName,
        newSet.weight,
        newSet.reps,
        newSet.order
      )

      if (createdSet) {
        setExerciseData((state) => {
          const newState = structuredClone(state)
          newState.sets = [...newState.sets, createdSet]
          return { ...newState }
        })
        toast({
          title: `${exerciseName}`,
          description: 'Set successfully added!',
          variant: 'success'
        })
      }
    } catch (error) {
      toast({
        title: `Something went wrong`,
        description: 'Failed to add set!',
        variant: 'destructive'
      })
    } finally {
      setShowAddSetInput(false)
    }
  }

  const editSet = async () => {
    try {
      const set = { ...exerciseData.sets[selectedSet] }
      if (editCheckboxes.plannedSet) {
        await editPlannedSet(exerciseData.id, set.reps, set.weight, set.order)
      }
      if (editCheckboxes.performedSet && set.performed_exercise_id) {
        const updatedSet = await editPerformedSet({
          id: set.performed_exercise_id,
          performanceStatus: getPerformanceStatus(sets[selectedSet], set),
          reps: set.reps,
          weight: set.weight,
          order: set.order
        })

        if (updatedSet) {
          updatedSet.performanceStatus = updatedSet.performance_status
          delete updatedSet.performance_status
          setExerciseData((state) => {
            const newState = structuredClone(state)
            newState.sets[selectedSet] = { ...updatedSet }

            return { ...newState }
          })
          const newParams = buildSearchParams(
            searchParams.get('completedSets'),
            pathname,
            exerciseData.name,
            updatedSet
          )
          router.replace(newParams, { scroll: false })
        }
      }
      toast({
        title: `Set changes`,
        description: 'Successfully saved!',
        variant: 'success'
      })
      if (editCheckboxes.plannedSet) {
        router.refresh()
      }
    } catch (error) {
      console.log(error)

      toast({
        title: `Could not save your set changes`,
        variant: 'destructive'
      })
    } finally {
      setShowInput(false)
    }
  }

  const deleteSet = async (exerciseId: string) => {
    try {
      const result = await deletePlannedSet(exerciseId)
      toast({
        title: `Set`,
        description: 'Successfully deleted!',
        variant: 'success'
      })
      setExerciseData((state) => {
        const newState = structuredClone(state)
        newState.sets = newState.sets.filter((set) => set.id !== exerciseId)
        return newState
      })
    } catch (error) {
      toast({
        title: `Could not delete set`,
        description: 'Please try again later',
        variant: 'destructive'
      })
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

          newState.sets = [
            ...sets.map((set) => {
              debugger
              if (set.id === completedSet.id) {
                set.performanceStatus = completedSet.performanceStatus
                set.performed_exercise_id = completedSet.performed_exercise_id
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
  console.log(exerciseData)

  return (
    <>
      <WorkoutCard.Exercise
        name={exerciseName}
        className={`flex justify-between`}
        isEditMode={isEditMode}
      >
        <Button
          variant="ghost"
          className={`p-2 ${isEditMode ? 'text-blue-500' : 'text-gray-500'}`}
          onClick={() => setIsEditMode((state) => !state)}
        >
          <FilePenIcon className="h-5 w-5" />
        </Button>
      </WorkoutCard.Exercise>
      <WorkoutCard.SetsContainer isEditMode={isEditMode}>
        {exerciseData.sets.map((set: GroupedExerciseSet, index: number) => {
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
        disabled={
          !isEditMode &&
          Boolean(exerciseData.sets[selectedSet].performanceStatus)
        }
      >
        <div className="flex gap-1 justify-center flex-wrap">
          {isEditMode && (
            <div className="w-full flex justify-start">
              <div
                className={`flex w-${
                  !exerciseData.sets[selectedSet]?.performanceStatus
                    ? 'full'
                    : '1/2'
                } items-center gap-2`}
              >
                <Label htmlFor="plannedSet">Edit planned set</Label>
                <Input
                  className="w-4"
                  name="plannedSet"
                  id="plannedSet"
                  type="checkbox"
                  checked={editCheckboxes.plannedSet}
                  onChange={handleEditCheckboxChange}
                />
              </div>
              {exerciseData.sets[selectedSet]?.performanceStatus && (
                <div className="flex w-1/2 items-center gap-2">
                  <Label htmlFor="performedSet">Edit performed set</Label>
                  <Input
                    className="w-4"
                    name="performedSet"
                    id="performedSet"
                    type="checkbox"
                    checked={editCheckboxes.performedSet}
                    onChange={handleEditCheckboxChange}
                  />
                </div>
              )}
            </div>
          )}
          <Button
            disabled={
              (isEditMode &&
                !editCheckboxes.performedSet &&
                !editCheckboxes.plannedSet) ||
              (!isEditMode &&
                Boolean(exerciseData.sets[selectedSet].performanceStatus))
            }
            onClick={isEditMode ? () => editSet() : handleSubmit}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full bg-blue-500 text-white"
          >
            {isEditMode ? 'Save changes' : 'Complete set'}
          </Button>
          {isEditMode && (
            <Button
              onClick={() => deleteSet(exerciseData.sets[selectedSet].id)}
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
              onClick={addNewSet}
              className="bg-green-500 text-white hover:bg-green-600"
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
