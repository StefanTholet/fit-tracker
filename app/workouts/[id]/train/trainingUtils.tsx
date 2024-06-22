import { GroupedExerciseSet } from '@/interfaces/workout'

export const getPerformanceStatus = (
  set: GroupedExerciseSet,
  performedSet: GroupedExerciseSet
): 'met' | 'not-met' | 'exceeded' => {
  const targetReps = Number(set?.reps)
  const performedReps = Number(performedSet?.reps)
  const targetWeight = Number(set?.weight)
  const liftedWeight = Number(performedSet?.weight)
  if (targetReps > performedReps || targetWeight > liftedWeight) {
    return 'not-met'
  } else if (performedReps > targetReps || liftedWeight > targetWeight) {
    return 'exceeded'
  }
  return 'met'
}
