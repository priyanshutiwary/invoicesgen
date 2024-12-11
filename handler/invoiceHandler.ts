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
        setInvoiceHistory(prevHistory => {
            // Ensure prevHistory is always an array
            const history = Array.isArray(prevHistory) ? prevHistory : []
            return [...history, response.data.invoice]
          })
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

// view invoice history 
  const handleViewInvoiceHistory = async (businessId: string) => {
    console.log(businessId);
    
    try {
      const response = await axios.get(`/api/setInvoices?businessId=${businessId}`)
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
  
  // mark payment as paid 
  const handleExtendDate = async (invoiceId: string, newDueDate: Date) => {
    
    const newDateInIsoDateString = new Date(newDueDate.getTime() - newDueDate.getTimezoneOffset() * 60000)
    .toISOString()
    .replace('Z', '+00:00');
    console.log(newDateInIsoDateString);
    
    
    
    try {
      const response = await axios.patch(`/api/setInvoices/`, {  invoiceId:invoiceId,action:"extendDueDate" ,newDueDate: newDateInIsoDateString })
  
      if (response.data.success) {
        toast({
          title: 'Due Date Extended',
          description: `Invoice due date has been successfully extended to ${newDueDate.toLocaleDateString()}.`,
        })
  
        // Optionally log this activity
        
  
        // Update local state with the updated invoice
        // setInvoiceHistory(prevHistory =>
        //   prevHistory.map(invoice =>
        //     invoice._id === invoiceId ? { ...invoice, dueDate: newDueDate } : invoice
        //   )
        // )
      } else {
        throw new Error(response.data.message || 'Failed to extend due date')
      }
    } catch (error) {
      console.error('Error extending due date:', error)
      toast({
        title: 'Error',
        description: 'Failed to extend due date',
        variant: 'destructive',
      })
    }
  }
  
  const handleMarkPayment = async (invoiceId: string) => {
    try {
        console.log("reached handleMarkPayment");
        
      // Update the invoice status to 'paid'
      const response = await axios.patch(`/api/setInvoices`,{ invoiceId:invoiceId,action:"markAsPaid" })
  
      if (response.data.success) {
        toast({
          title: 'Payment Marked as Paid',
          description: 'Invoice payment has been successfully marked as paid.',
        })
  
        // Optionally log this activity
        
  
        // Update local state with the updated invoice
        setInvoiceHistory(prevHistory =>
          prevHistory.map(invoice =>
            invoice._id === invoiceId ? { ...invoice, paymentStatus: 'paid' } : invoice
          )
        )
      } else {
        throw new Error(response.data.message || 'Failed to mark payment as paid')
      }
    } catch (error) {
      console.error('Error marking payment as paid:', error)
      toast({
        title: 'Error',
        description: 'Failed to mark payment as paid',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      const response = await axios.delete(`/api/setInvoices/${invoiceId}`)
  
      if (response.data.success) {
        toast({
          title: 'Invoice Deleted',
          description: 'Invoice has been successfully deleted.',
        })
  
        // Update local state to remove the deleted invoice
        setInvoiceHistory(prevHistory =>
          prevHistory.filter(invoice => invoice._id !== invoiceId)
        )
      } else {
        throw new Error(response.data.message || 'Failed to delete invoice')
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete invoice',
        variant: 'destructive',
      })
    }
  }
  

  return {
    handleSaveInvoice,
    handleViewInvoiceHistory,
    handleViewInvoice,
    handleExtendDate,
    handleMarkPayment,
    handleDeleteInvoice
  }
}

//mark payment as paid 