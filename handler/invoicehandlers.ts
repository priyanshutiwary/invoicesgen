import { useCallback } from 'react'
import { Invoice } from '@/backend/types/type'

export const useInvoiceHandlers = (setCurrentInvoice: React.Dispatch<React.SetStateAction<Invoice | null>>, setIsInvoicePreviewOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  const handleViewInvoiceHistory = useCallback((invoice: Invoice) => {
    setCurrentInvoice(invoice)
    setIsInvoicePreviewOpen(true)
  }, [setCurrentInvoice, setIsInvoicePreviewOpen])

  return {
    handleViewInvoiceHistory
  }
}