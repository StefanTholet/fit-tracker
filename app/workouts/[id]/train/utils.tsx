'use client'
import { CompletedSets } from './training'
import { Base64 } from 'js-base64'

const getDecodedParams = (params: string | null) => {
  const decodedParams = params ? Base64.decode(params) : null
  return decodedParams
}

export const buildSearchParams = (
  params: string | null,
  pathname: string,
  exerciseName: string,
  completedSet: CompletedSets
) => {
  const decodedParams = getDecodedParams(params)
  let exercises
  if (decodedParams) {
    exercises = decodedParams
      .split('exercise=')
      .filter((el) => el !== '?' && el !== '')

    const completedSetIndex = exercises.findIndex((exerciseString) => {
      const exerciseData = exerciseString.split('=')
      const setData = JSON.parse(exerciseData[1])
      return (
        completedSet.performed_exercise_id === setData.performed_exercise_id
      )
    })
    if (completedSetIndex >= 0) {
      exercises[completedSetIndex] = `${exerciseName}=${JSON.stringify(
        completedSet
      )}`
    } else {
      exercises.push(`${exerciseName}=${JSON.stringify(completedSet)}`)
    }

    return (
      pathname + '?completedSets=' + Base64.encode(exercises.join('exercise='))
    )
  }

  const url = Base64.encode(
    'exercise=' + exerciseName + '=' + JSON.stringify(completedSet)
  )
  return pathname + '?completedSets=' + url
}
