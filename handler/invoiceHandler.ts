import axios from 'axios'
import { toast } from '@/components/ui/use-toast'
import { Invoice } from '@/backend/types/type'

export const useInvoiceHandler = (
  setInvoiceHistory: React.Dispatch<React.SetStateAction<Invoice[]>>,
  setIsInvoicePreviewOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentInvoice: React.Dispatch<React.SetStateAction<Invoice | null>>
) => {
  const handleSaveInvoice = async (invoice: Invoice) => {
    try {
      console.log('Invoice data being sent to API:', invoice)

      const response = await axios.post('/api/setInvoices', invoice)
      
      console.log('API response:', response.data)

      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Invoice saved successfully',
        })
        setIsInvoicePreviewOpen(false)
        setInvoiceHistory(prevHistory => [...prevHistory, response.data.invoice])
        setCurrentInvoice(null)
        return true
      } else {
        throw new Error(response.data.message || 'Failed to save invoice')
      }
    } catch (error) {
      console.error('Error saving invoice:', error)
      toast({
        title: 'Error',
        description: 'Failed to save invoice',
        variant: 'destructive',
      })
      return false
    }
  }

  const handleViewInvoiceHistory = async (businessId: string) => {
    try {
      const response = await axios.get(`/api/setInvoices?businessId=${businessId}`)
      
      console.log(response);
      
      if (response.data.success) {
        setInvoiceHistory(response.data.data)
      } else {
        throw new Error(response.data.message || 'Failed to fetch invoice history')
      }
    } catch (error) {
      console.error('Error fetching invoice history:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch invoice history',
        variant: 'destructive',
      })
    }
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice)
    setIsInvoicePreviewOpen(true)
  }

  return {
    handleSaveInvoice,
    handleViewInvoiceHistory,
    handleViewInvoice,
  }
}