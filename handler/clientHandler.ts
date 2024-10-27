import { useCallback } from 'react'
import axios from 'axios'
import { toast } from "@/components/ui/use-toast"
import { ApiResponse } from '@/backend/types/ApiResponse'
import { Client } from '@/backend/types/type'

export const useClientHandlers = (selectedBusinessId: string, setClients: React.Dispatch<React.SetStateAction<Client[]>>, setIsClientOpen: React.Dispatch<React.SetStateAction<boolean>>, setIsEditClientOpen: React.Dispatch<React.SetStateAction<boolean>>, setEditingClient: React.Dispatch<React.SetStateAction<Client | null>>) => {
  const handleAddClient = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newClient: Omit<Client, 'id'> = {
      businessId:selectedBusinessId,
      name: formData.get('clientName') as string,
      contact: formData.get('clientEmail') as string,
      // phone: formData.get('clientPhone') as string,
      gstNumber: formData.get('clientGstNumber') as string
    }
    console.log(newClient)
    try {
      const response = await axios.post<ApiResponse>('/api/setClient', newClient)
      console.log(response.data.data);
      
      
      setClients(prev => [...prev, response.data.data]);
      
      
      setIsClientOpen(false)

    } catch (error) {
      console.error('Error adding client', error)
      toast({
        title: 'Error',
        description: 'Failed to add client',
        variant: 'destructive'
      })
    }
  }, [selectedBusinessId, setClients, setIsClientOpen])

  const handleEditClient = useCallback(async (e: React.FormEvent<HTMLFormElement>, editingClient: Client | null) => {
    e.preventDefault()
    if (!editingClient) return
    
    const formData = new FormData(e.currentTarget)
    console.log(formData);
    
    const updatedClient: Client = {
      _id: editingClient._id,
      name: formData.get('clientName') as string,
      contact: formData.get('clientEmail') as string,
      gst_number: formData.get('clientGstNumber') as string
    }
    console.log(updatedClient);
    
    try {
      await axios.put<ApiResponse>(`/api/setClient?businessId=${selectedBusinessId}&clientId=${updatedClient._id}`, updatedClient)
      setClients(prev => prev.map(client => client._id === updatedClient._id ? updatedClient : client))
      setIsEditClientOpen(false)
      setEditingClient(null)
    } catch (error) {
      console.error('Error updating client', error)
      toast({
        title: 'Error',
        description: 'Failed to update client',
        variant: 'destructive'
      })
    }
  }, [selectedBusinessId, setClients, setIsEditClientOpen, setEditingClient])
  const handleDeleteClient = useCallback(async (_id: number) => {
    try {
      await axios.delete<ApiResponse>(`/api/setClient?businessId=${selectedBusinessId}&clientId=${_id}`)
      setClients(prev => prev.filter(clients => clients._id !== _id))
    } catch (error) {
      console.error('Error deleting client', error)
      toast({
        title: 'Error',
        description: 'Failed to delete client',
        variant: 'destructive'
      })
    }
  }, [selectedBusinessId, setClients])

  return {
    handleAddClient,
    handleEditClient,
    handleDeleteClient
  }
}