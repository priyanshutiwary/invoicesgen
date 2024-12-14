"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios' 
import { AxiosError } from 'axios' 
import { useToast } from '@/hooks/use-toast'

// Define the ApiResponse interface if you have a specific structure
interface ApiResponse {
  message: string;
  // Add other properties as needed
}

export default function SignUpPage() {
  // const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {toast} = useToast()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState({ username: '', contact: '', password: '' }); // {{ edit_4 }} Initialize data state
  
  

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // setIsLoading(true)

    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/signup', data); 

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/verify/${data.username}`); // {{ edit_6 }} Use data.username for routing

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      const errorMessage = axiosError.response?.data.message || 'There was a problem with your sign-up. Please try again.'; // {{ edit_7 }} Fix error message assignment

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false);
      
    }

    
    
  }
  // const handleBack = () => {
  //   router.push('/'); // Navigate to the home page
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg relative">
        <Button
          variant="ghost"
          onClick={() => window.location.href = '/'}
          className="absolute top-4 left-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          aria-label="Go back to login"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sign up for InvoiceGen</h1>
          <p className="text-gray-500 dark:text-gray-400">Create your account to get started</p>
          <form onSubmit={onSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">Username</Label>
              <Input 
                id="username" 
                placeholder="" 
                required 
                onChange={(e) => setData({ ...data, username: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input 
                id="contact" 
                placeholder="" 
                type="email" 
                required 
                onChange={(e) => setData({ ...data, contact: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                onChange={(e) => setData({ ...data, password: e.target.value })}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <Button 
              className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
          <div className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a 
              href="/sign-in" 
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
