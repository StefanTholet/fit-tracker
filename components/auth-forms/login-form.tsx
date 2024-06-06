'use client'
import React from 'react'
import { FormControl } from '@/components/ui/form' // Adjust imports based on ShadCN setup
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

const LoginForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    // Handle login logic here
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <FormControl>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          required
          className="mt-1 block w-full"
        />
      </FormControl>
      <FormControl>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          required
          className="mt-1 block w-full"
        />
      </FormControl>
      <FormControl>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
          className="mt-1 block w-full"
        />
      </FormControl>
      <Button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        Login
      </Button>
    </form>
  )
}

export default LoginForm
