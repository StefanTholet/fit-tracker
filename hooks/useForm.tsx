'use client'
import { useState, ChangeEvent } from 'react'

// Define a type for your initial form data
interface InitialData {
  [key: string]: any
}

const useForm = (initialData: InitialData) => {
  // Explicitly type the initialData parameter
  const [formData, setFormData] = useState(initialData || {})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e
    const { name, value } = target
    // Explicitly type the data parameter in the callback
    setFormData((data: InitialData) => ({ ...data, [name]: value }))
  }

  return { formData, handleChange, isSubmitted, setIsSubmitted }
}

export default useForm
