'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

export const OTPVerification=() => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
//   const [countdown, setCountdown] = useState(90)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCountdown((prevCountdown) => {
//         if (prevCountdown <= 1) {
//           clearInterval(timer)
//           router.push('/login') // Redirect to login page when countdown reaches 0
//           return 0
//         }
//         return prevCountdown - 1
//       })
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [router])

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
    
    setTimeout(() => {
      setIsVerifying(false)
      if (enteredOtp === '123456') {
        toast({
          title: "Success",
          description: "OTP verified successfully!",
        })
        router.push('/dashboard') // Redirect to dashboard on success
      } else {
        toast({
          title: "Error",
          description: "Incorrect OTP. Please try again.",
          variant: "destructive",
        })
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md relative">
        <Button
          variant="ghost"
          onClick={() => router.push('/login')}
          className="absolute top-4 left-4"
          aria-label="Go back to login"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Verify Your Account</h1>
          <p className="text-gray-500">We've sent a code to your email. Please enter it below.</p>
          {/* <p className="text-sm text-gray-400">Time remaining: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</p> */}
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
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => inputRefs.current[index] = el}
                className="w-12 h-12 text-center text-2xl"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
          <Button className="w-full" type="submit" disabled={isVerifying || otp.some(v => v === '')}>
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
            className="text-sm text-blue-600 hover:underline"
          >
            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
          </Button>
        </div>
      </div>
    </div>
  )
}