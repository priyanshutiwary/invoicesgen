'use client'

import { useState } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building, Mail, MapPin, FileText, Hash } from "lucide-react"

export default function OnboardingPage() {
  const [businessData, setBusinessData] = useState({
    name: '',
    email: '',
    address: '',
    description: '',
    gst_number: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBusinessData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Business data submitted:', businessData)
  }

  const inputFields = [
    { name: 'name', label: 'Business Name', icon: Building, type: 'text' },
    { name: 'email', label: 'Business Email', icon: Mail, type: 'email' },
    { name: 'address', label: 'Business Address', icon: MapPin, type: 'textarea' },
    { name: 'description', label: 'Business Description', icon: FileText, type: 'textarea' },
    { name: 'gst_number', label: 'GST Number', icon: Hash, type: 'text' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Set Up Your Business</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {inputFields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">{field.label}</Label>
                <div className="relative">
                  <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={businessData[field.name as keyof typeof businessData]}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  ) : (
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={businessData[field.name as keyof typeof businessData]}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  )}
                </div>
              </motion.div>
            ))}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Complete Setup</Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}