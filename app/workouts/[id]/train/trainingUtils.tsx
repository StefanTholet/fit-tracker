export const getPerformanceStatus = (
  targetReps: number,
  performedReps: number,
  targetWeight: number,
  liftedWeight: number
): 'met' | 'not-met' | 'exceeded' => {
  if (targetReps > performedReps || targetWeight > liftedWeight) {
    return 'not-met'
  } else if (performedReps > targetReps || liftedWeight > targetWeight) {
    return 'exceeded'
  }
  return 'met'
}
