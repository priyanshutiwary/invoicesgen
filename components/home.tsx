"use client"

import React, { useState, useEffect, ReactNode, ErrorInfo } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, DollarSign, TrendingUp, CheckCircle, Star, Users } from "lucide-react"
import { LucideIcon } from 'lucide-react'

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>
    }

    return this.props.children
  }
}

// Define the props interface for the Feature component
interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Correct typing for Feature component using React.memo
const Feature: React.FC<FeatureProps> = React.memo(({ icon: Icon, title, description }) => (
  <Card>
    <CardHeader>
      <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-4" />
      <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm sm:text-base text-gray-600">{description}</p>
    </CardContent>
  </Card>
))

// Define the props interface for the Testimonial component
interface TestimonialProps {
  name: string;
  role: string;
  quote: string;
}

// Correct typing for Testimonial component using React.memo
const Testimonial: React.FC<TestimonialProps> = React.memo(({ name, role, quote }) => (
  <Card>
    <CardContent className="pt-6">
      <p className="text-sm sm:text-base text-gray-600 italic mb-4">&quot;{quote}&quot;</p>
      <p className="font-semibold">{name}</p>
      <p className="text-xs sm:text-sm text-gray-500">{role}</p>
    </CardContent>
  </Card>
))

export default function LandingPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const features = [
    { icon: FileText, title: "Easy Invoicing", description: "Create professional invoices in minutes with our intuitive interface." },
    { icon: DollarSign, title: "Get Paid Faster", description: "Streamline your payment process with integrated payment options." },
    { icon: TrendingUp, title: "Insightful Analytics", description: "Track your business growth with powerful reporting tools." },
    { icon: CheckCircle, title: "Automated Reminders", description: "Set up automatic payment reminders to reduce late payments." },
    { icon: Users, title: "Client Management", description: "Manage your client information and history in one place." },
    { icon: Star, title: "Customizable Templates", description: "Create branded invoices with customizable templates." },
  ]

  const testimonials = [
    { name: "John Doe", role: "Small Business Owner", quote: "InvoiceGen has revolutionized our invoicing process. It's so easy to use and has saved us countless hours!" },
    { name: "Jane Smith", role: "Freelance Designer", quote: "As a freelancer, keeping track of invoices was always a hassle. InvoiceGen has made it simple and professional." },
    { name: "Mike Johnson", role: "Marketing Agency CEO", quote: "The analytics feature in InvoiceGen has given us valuable insights into our cash flow. Highly recommended!" },
  ]

  if (!isClient) {
    return null // or a loading spinner
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">Welcome to InvoiceGen</h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Simplify your invoicing process with our powerful and easy-to-use software.
            Create, send, and track invoices in minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Link href="/sign-in">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">Why Choose InvoiceGen?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-blue-600 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Streamline Your Invoicing?</h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust InvoiceGen for their invoicing needs.
            Sign up today and experience the difference!
          </p>
          <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </section>

        {/* Footer */}
        <footer className="py-6 sm:py-8 px-4 bg-gray-100">
          <div className="container mx-auto text-center text-gray-600">
            <p className="text-sm sm:text-base">&copy; 2024 InvoiceGen. All rights reserved.</p>
            <div className="mt-4 space-y-2 sm:space-y-0">
              <Link href="/privacy" className="text-blue-600 hover:underline mx-2 text-sm sm:text-base">Privacy Policy</Link>
              <Link href="/terms" className="text-blue-600 hover:underline mx-2 text-sm sm:text-base">Terms of Service</Link>
              <Link href="/contact" className="text-blue-600 hover:underline mx-2 text-sm sm:text-base">Contact Us</Link>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
