'use client'
import { useState, ChangeEvent } from 'react'

interface InitialData {
  [key: string]: any
}

const useForm = (initialData: InitialData) => {
  const [formData, setFormData] = useState(initialData || {})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e
    const { name, value } = target

    setFormData((data: InitialData) => ({ ...data, [name]: value }))
  }

  return { formData, handleChange, isSubmitted, setIsSubmitted }
}

export default useForm
