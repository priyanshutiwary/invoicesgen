import { useCallback } from 'react'
import axios from 'axios'
import { toast } from "@/components/ui/use-toast"
import { ApiResponse } from '@/backend/types/ApiResponse'
import { Item } from '@/backend/types/type'

export const useItemHandlers = (items,selectedBusinessId: string, setItems: React.Dispatch<React.SetStateAction<Item[]>>, setIsItemOpen: React.Dispatch<React.SetStateAction<boolean>>, setIsEditItemOpen: React.Dispatch<React.SetStateAction<boolean>>, setEditingItem: React.Dispatch<React.SetStateAction<Item | null>>) => {
  const handleAddItem = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    console.log("printed form data");
    console.log(selectedBusinessId);
    
    console.log(formData);
    const newItem: Omit<Item, 'id'> = {
      businessId:selectedBusinessId,
      name: formData.get('itemName') as string,
      description: formData.get('itemDescription') as string,
      price: parseFloat(formData.get('itemPrice') as string),
      tax: parseFloat(formData.get('itemTax') as string)
    }
    console.log(newItem)
    try {
      
      const response = await axios.post<ApiResponse>("/api/setItem", newItem)
      console.log(response);
      
      setItems(prev => [...prev, response.data.item])
      console.log('printed from here:s',items);
      
      setIsItemOpen(false)
    } catch (error) {
      console.error('Error adding item', error)
      toast({
        title: 'Error',
        description: 'Failed to add item',
        variant: 'destructive'
      })
    }
  }, [selectedBusinessId, setItems, setIsItemOpen])

  const handleEditItem = useCallback(async (e: React.FormEvent<HTMLFormElement>, editingItem: Item | null) => {
    e.preventDefault()
    if (!editingItem) return
    const formData = new FormData(e.currentTarget)
    const updatedItem: Item = {
      id: editingItem.id,
      name: formData.get('itemName') as string,
      description: formData.get('itemDescription') as string,
      price: parseFloat(formData.get('itemPrice') as string),
      tax: parseFloat(formData.get('itemTax') as string)
    }
    try {
      await axios.put<ApiResponse>(`/api/updateItem/${selectedBusinessId}/${updatedItem.id}`, updatedItem)
      setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item))
      setIsEditItemOpen(false)
      setEditingItem(null)
    } catch (error) {
      console.error('Error updating item', error)
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive'
      })
    }
  }, [selectedBusinessId, setItems, setIsEditItemOpen, setEditingItem])

  const handleDeleteItem = useCallback(async (id: number) => {
    try {
      await axios.delete<ApiResponse>(`/api/deleteItem/${selectedBusinessId}/${id}`)
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting item', error)
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive'
      })
    }
  }, [selectedBusinessId, setItems])

  return {
    handleAddItem,
    handleEditItem,
    handleDeleteItem
  }
}