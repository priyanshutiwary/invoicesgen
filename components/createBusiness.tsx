// import React from 'react'
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { BusinessDetails } from '@/backend/types/type'

// interface CreateBusinessPopupProps {
//   isOpen: boolean;
//   onClose: () => void;
//   businessDetails: BusinessDetails;
//   handleBusinessDetailsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
//   handleSaveBusinessDetails: () => void;
//   user_id: string | undefined;
//   isLoading: boolean;
// }

// export function CreateBusinessPopup({
//   isOpen,
//   onClose,
//   businessDetails,
//   handleBusinessDetailsChange,
//   handleSaveBusinessDetails,
//   user_id,
//   isLoading
// }: CreateBusinessPopupProps) {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Create New Business</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={(e) => { e.preventDefault(); handleSaveBusinessDetails(); }}>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="name">Business Name</Label>
//               <Input id="name" name="name" value={businessDetails.name} onChange={handleBusinessDetailsChange} />
//             </div>
//             <div>
//               <Label htmlFor="email">Contact</Label>
//               <Input id="email" name="email" value={businessDetails.email} onChange={handleBusinessDetailsChange} />
//             </div>
            
//             <div>
//               <Label htmlFor="address">Address</Label>
//               <Input id="address" name="address" value={businessDetails.address} onChange={handleBusinessDetailsChange} />
//             </div>
//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Textarea id="description" name="description" value={businessDetails.description} onChange={handleBusinessDetailsChange} />
//             </div>
//             <div>
//               <Label htmlFor="gstNumber">GST Number</Label>
//               <Input id="gstNumber" name="gstNumber" value={businessDetails.gstNumber} onChange={handleBusinessDetailsChange} />
//             </div>
//             <Button type="submit" disabled={isLoading}>
//             {isLoading ? 'Creating...' : 'Create Business'}
//             </Button>          </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }


import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { BusinessDetails } from '@/backend/types/type'
import { X } from 'lucide-react'

interface CreateBusinessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  businessDetails: BusinessDetails;
  handleBusinessDetailsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveBusinessDetails: () => void;
  user_id: string | undefined;
  isLoading: boolean;
}

export function CreateBusinessPopup({
  isOpen,
  onClose,
  businessDetails,
  handleBusinessDetailsChange,
  handleSaveBusinessDetails,
  user_id,
  isLoading
}: CreateBusinessPopupProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!businessDetails.name) newErrors.name = "Business Name is required"
    if (!businessDetails.email) newErrors.email = "Contact is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      handleSaveBusinessDetails()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[525px] p-0 bg-white overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="px-6 py-4 bg-[#4169E1] text-white flex justify-between items-center">
                <DialogTitle className="text-xl font-semibold">Create New Business</DialogTitle>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="text-white hover:bg-[#3154b3] rounded-full p-2"
                >
                  {/* <X className="h-6 w-6" /> */}
                </Button>
              </DialogHeader>
              <Card className="border-0 shadow-none">
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-5">
                    {[
                      { id: 'name', label: 'Business Name', type: 'input', required: true },
                      { id: 'email', label: 'Contact', type: 'input', required: true },
                      { id: 'address', label: 'Address', type: 'input' },
                      { id: 'description', label: 'Description', type: 'textarea' },
                      { id: 'gstNumber', label: 'GST Number', type: 'input' },
                    ].map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        {field.type === 'input' ? (
                          <Input
                            id={field.id}
                            name={field.id}
                            value={businessDetails[field.id as keyof BusinessDetails]}
                            onChange={handleBusinessDetailsChange}
                            className={`h-11 rounded-lg border-gray-200 focus:border-[#4169E1] focus:ring-[#4169E1] transition-all duration-300 ease-in-out ${
                              errors[field.id] ? 'border-red-500' : ''
                            }`}
                            required={field.required}
                          />
                        ) : (
                          <Textarea
                            id={field.id}
                            name={field.id}
                            value={businessDetails[field.id as keyof BusinessDetails]}
                            onChange={handleBusinessDetailsChange}
                            className="min-h-[100px] rounded-lg border-gray-200 focus:border-[#4169E1] focus:ring-[#4169E1] transition-all duration-300 ease-in-out"
                          />
                        )}
                        {errors[field.id] && (
                          <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                        )}
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-11 bg-[#4169E1] hover:bg-[#3154b3] text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4169E1] focus:ring-opacity-50"
                      >
                        {isLoading ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center"
                          >
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creating...
                          </motion.div>
                        ) : (
                          'Create Business'
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </Card>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}