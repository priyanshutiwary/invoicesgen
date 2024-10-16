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


  const handleEditItem = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const itemId = formData.get('itemId')
    
    const updatedItem: Item = {
      
      name: formData.get('itemName') as string,
      description: formData.get('itemDescription') as string,
      price: parseFloat(formData.get('itemPrice') as string),
      tax: parseFloat(formData.get('itemTax') as string)
    }
    
    try {
      const response = await axios.put<ApiResponse>(`/api/setItem?businessId=${selectedBusinessId}&itemId=${itemId}`, updatedItem)
      setItems(prev => prev.map(item => item._id === itemId ? response.data.item : item))
      setIsEditItemOpen(false)
      setEditingItem(null)
      toast({
        title: 'Success',
        description: 'Item updated successfully',
        variant: 'default'
      })
    } catch (error) {
      console.error('Error updating item', error)
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive'
      })
    }
  }, [selectedBusinessId, setItems, setIsEditItemOpen, setEditingItem])

  // const handleEditItem = useCallback(async (e: React.FormEvent<HTMLFormElement>, editingItem: Item | null) => {
  //   e.preventDefault()
  //   console.log("reached");
    
  //   console.log(editingItem);

  //   const formData = new FormData(e.currentTarget)
    
  //   const updatedItem: Item = {
  //     _id: editingItem._id,
  //     name: formData.get('itemName') as string,
  //     description: formData.get('itemDescription') as string,
  //     price: parseFloat(formData.get('itemPrice') as string),
  //     tax: parseFloat(formData.get('itemTax') as string)
  //   }
  //   console.log(updatedItem);
    
  //   try {
  //     await axios.put<ApiResponse>(`/api/setItem?businessId=${selectedBusinessId}&itemId=${updatedItem._id}`, updatedItem)
  //     setItems(prev => prev.map(item => item._id === updatedItem._id ? updatedItem : item))
  //     setIsEditItemOpen(false)
  //     setEditingItem(null)
  //   } catch (error) {
  //     console.error('Error updating item', error)
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to update item',
  //       variant: 'destructive'
  //     })
  //   }
  // }, [selectedBusinessId, setItems, setIsEditItemOpen, setEditingItem])

  const handleDeleteItem = useCallback(async (id: number) => {
    console.log("reached");
    
    try {
      await axios.delete<ApiResponse>(`/api/setItem?businessId=${selectedBusinessId}&itemId=${id}`)
      setItems(prev => prev.filter(item => item._id !== id))
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