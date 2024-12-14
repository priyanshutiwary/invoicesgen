'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, ArrowLeft } from 'lucide-react'
import { useParams,useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast'
import { ApiResponse } from '@/backend/types/ApiResponse'

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
//   const [countdown, setCountdown] = useState(90)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  
  const params = useParams<{ username: string }>();
  const { toast } = useToast()
  
  

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])



  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false

    const newOtp = [...otp]
    newOtp[index] = element.value
    setOtp(newOtp)

    if (element.value !== '') {
      if (index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    const enteredOtp = otp.join('')
    console.log('Verifying OTP:', enteredOtp)
    try {
        const response = await axios.post<ApiResponse>(`/api/verify-code`, {
          username: params.username,
          code: enteredOtp,
        });
  
        toast({
          title: 'Success',
          description: response.data.message,
        });
  
        router.replace('/sign-in');
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Verification Failed',
          description:
            axiosError.response?.data.message ??
            'An error occurred. Please try again.',
          variant: 'destructive',
        });
      }
  
    
    setTimeout(() => {
      setIsVerifying(false)
    }, 2000)
  }

  const handleResend = () => {
    if (resendCooldown === 0) {
      console.log('Resending OTP')
      setResendCooldown(30)
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email.",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md relative">
        <Button
          variant="ghost"
          onClick={() => router.push('/sign-in')}
          className="absolute top-4 left-4 text-gray-200"
          aria-label="Go back to login"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-100">Verify Your Account</h1>
          <p className="text-gray-300">We&apos;ve sent a code to your email. Please enter it below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={data}
                onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="w-12 h-12 text-center text-2xl text-gray-200 bg-gray-700 border border-gray-600"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
          <Button className="w-full bg-blue-600 text-white" type="submit" disabled={isVerifying || otp.some(v => v === '')}>
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </Button>
        </form>
        <div className="text-center">
          <Button 
            variant="link" 
            onClick={handleResend} 
            disabled={resendCooldown > 0}
            className="text-sm text-blue-400 hover:underline"
          >
            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Only export the component as default
export default OTPVerification;