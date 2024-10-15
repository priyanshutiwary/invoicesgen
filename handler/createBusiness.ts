import { useState } from 'react'
import axios from 'axios'
import { toast } from "@/components/ui/use-toast"
import { ApiResponse } from '@/backend/types/ApiResponse'
import { BusinessDetails, Business } from '@/types'

export const useCreateBusinessHandler = (
  user_id: string | undefined,
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>,
  setSelectedBusinessId: React.Dispatch<React.SetStateAction<string>>
) => {
  const [isCreateBusinessOpen, setIsCreateBusinessOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newBusinessDetails, setNewBusinessDetails] = useState<BusinessDetails>({
    userId: user_id || "",
    name: "",
    email: "",
    address: "",
    description: "",
    gstNumber: ""
  })

  const handleCreateBusinessClick = () => {
    setIsCreateBusinessOpen(true)
    setNewBusinessDetails(prev => ({
      ...prev,
      userId: user_id || ""
    }))
  }

  const handleNewBusinessDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewBusinessDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleSaveNewBusiness = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/createBusiness', newBusinessDetails)
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message || "New business created successfully",
        })
        // Refresh the list of businesses
        const businessesResponse = await axios.get<ApiResponse>(`/api/getUserBusinesses?user_id=${user_id}`)
        setBusinesses(businessesResponse.data.businesses)
        // setSelectedBusinessId(response.data.data._id)
        setIsCreateBusinessOpen(false)
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to create new business",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating business', error)
      if (axios.isAxiosError(error) && error.response) {
        toast({
          title: 'Error',
          description: error.response.data.message || 'Failed to create new business',
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive'
        })
      }
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleClose = () => {
    if (!isLoading) {
      setIsCreateBusinessOpen(false)
    }
  }

  return {
    isCreateBusinessOpen,
    setIsCreateBusinessOpen,
    newBusinessDetails,
    handleCreateBusinessClick,
    handleNewBusinessDetailsChange,
    handleSaveNewBusiness,
    handleClose,
    isLoading
  }
}