"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios' // {{ edit_1 }} Import axios correctly
import { AxiosError } from 'axios' // {{ edit_3 }} Import AxiosError for error handling
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
      const response = await axios.post<ApiResponse>('/api/signup', data); // {{ edit_5 }} Use data state for the request

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <Button
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="absolute top-4 left-4" // Positioned at the top left corner inside the div
            aria-label="Go back to login"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        <h1 className="text-3xl font-bold">Sign up for InvoiceGen</h1>
        <p className="text-gray-500">Create your account to get started</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="" required onChange={(e) => setData({ ...data, username: e.target.value })} /> {/* {{ edit_8 }} Update username state */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="contact" placeholder="" type="email" required onChange={(e) => setData({ ...data, contact: e.target.value })} /> {/* {{ edit_9 }} Update email state */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required onChange={(e) => setData({ ...data, password: e.target.value })} /> {/* {{ edit_10 }} Update password state */}
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
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
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/sign-in" className="font-medium text-blue-600 hover:underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  )
}
