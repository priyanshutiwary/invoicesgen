"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const SignupPage = ()=> {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    // Here you would typically send the form data to your backend
    // and handle the response accordingly

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="absolute top-4 left-4" // Positioned at the top left corner inside the div
            aria-label="Go back to login"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        <div className="relative"> {/* Added relative positioning to the parent div */}
          
          <h1 className="text-3xl font-bold">Sign up for InvoiceGen</h1>
          <p className="text-gray-500">Create your account to get started</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="johndoe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="john@example.com" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-name">Business Name</Label>
            <Input id="business-name" placeholder="Acme Inc." required />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
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
          <a href="/login" className="font-medium text-blue-600 hover:underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  )
}