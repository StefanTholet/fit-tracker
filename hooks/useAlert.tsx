'use client'
import { useState } from 'react'
import Alert from '@/components/alert'
import { v4 as uuidv4 } from 'uuid'
import { AlertProps } from '@/interfaces/alert'

interface AlertInterface extends AlertProps {
  id: string
}
const useAlert = () => {
  const [alerts, setAlerts] = useState<AlertInterface[] | []>([])

  const getIsAlertAlreadyPresent = (alert: AlertInterface) =>
    alerts.find((currentAlert) => currentAlert?.id === alert?.id)

  const addAlert = (alert: AlertInterface) => {
    debugger
    const isAlreadyPresent = getIsAlertAlreadyPresent(alert)
    if (!isAlreadyPresent) {
      setAlerts((alerts) => ({ ...alerts, alert, id: uuidv4() }))
    }
  }

  const removeAlert = (id: string) =>
    setAlerts((alerts) => alerts.filter((alert) => alert.id !== id))

  return { alerts, addAlert, removeAlert, Alert }
}

export default useAlert
