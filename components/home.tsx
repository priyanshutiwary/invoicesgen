

"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, DollarSign, TrendingUp, CheckCircle, Star, Users, ArrowUpRight } from "lucide-react"
import { LucideIcon } from 'lucide-react'
import { motion } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"
import { Card3d } from "./ui/3d-card"

// Feature component props
interface FeatureProps {
  icon: LucideIcon
  title: string
  description: string
}

// Testimonial component props
interface TestimonialProps {
  name: string
  role: string
  quote: string
}

// Feature component with 3D effect
const Feature: React.FC<FeatureProps> = React.memo(({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <Card3d>
      <CardHeader className="space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
      </CardContent>
    </Card3d>
  </motion.div>
))

Feature.displayName = 'Feature'

// Testimonial component with 3D effect
const Testimonial: React.FC<TestimonialProps> = React.memo(({ name, role, quote }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    <Card3d>
      <CardContent className="pt-8">
        <div className="mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="inline-block h-5 w-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6">&quot;{quote}&quot;</p>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card3d>
  </motion.div>
))

Testimonial.displayName = 'Testimonial'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Invoicing for the Modern Business
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Create, send, and track professional invoices in minutes. 
            Powered by AI for maximum efficiency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/sign-in">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-lg h-14 px-8">
              Start Free Trial <ArrowUpRight className="ml-2 h-5 w-5" />
            </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg h-14 px-8">
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Everything You Need</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Powerful features to help you manage your business</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Loved by Businesses</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Join thousands of satisfied customers</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Card3d>
            <CardContent className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Business?</h2>
              <p className="text-xl mb-8 text-white/90">
                Join over 10,000 businesses that trust InvoiceGen for their invoicing needs.
              </p>
              <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="text-lg h-14 px-8">
                Start Your Free Trial
              </Button>
              </Link>
            </CardContent>
          </Card3d>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 dark:text-white">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Pricing</Link></li>
                <li><Link href="/integrations" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 dark:text-white">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Careers</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 dark:text-white">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Contact</Link></li>
                <li><Link href="/status" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">System Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 dark:text-white">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Terms of Service</Link></li>
                <li><Link href="/security" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400">&copy; 2024 InvoiceGen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
