'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import {ArrowLeft } from "lucide-react"
import axios from 'axios' 
import { AxiosError } from 'axios' 

interface ApiResponse {
  message: string;
  // Add other properties as needed
}

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPassword() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      console.log(data);
      
      setIsLoading(true)
      const response = await axios.post<ApiResponse>('/api/passResetCode', data); 

      toast({
        title: 'Instruction send',
        description: 'Instruction has been send to you mail/mobile ',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            aria-label="Go back to the previous page"
          >
            <ArrowLeft className="mr-1" />
            <span className="text-gray-800 dark:text-gray-100">Back</span>
          </Button>
        </div>
        
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Forgot Password
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-400"
              {...register('email')}
              disabled={isLoading}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </Button>
        </form>
      </div>
    </div>
  )
}
