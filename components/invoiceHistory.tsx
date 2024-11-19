

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, Eye, DollarSign, CalendarIcon, ArrowUpDown } from "lucide-react"
import { Invoice, BusinessDetails } from '@/backend/types/type'
import { motion, AnimatePresence } from 'framer-motion'

interface InvoiceHistoryProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  invoiceHistory: Invoice[]
  businessDetails: BusinessDetails
  handleViewInvoice: (invoice: Invoice) => void
  handleMarkPaid: (invoiceId: string) => Promise<void>
  handleExtendDate: (invoiceId: string, newDate: Date) => Promise<void>
  handleViewInvoiceHistory: (businessId: string) => Promise<void>
}

export function InvoiceHistory({
  isOpen = false,
  setIsOpen = () => {},
  invoiceHistory = [],
  businessDetails = { _id: '', name: '' },
  handleViewInvoice = () => {},
  handleMarkPaid = async () => {},
  handleExtendDate = async () => {},
  handleViewInvoiceHistory = async () => {}
}: InvoiceHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [extendDateDialogOpen, setExtendDateDialogOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [newDueDate, setNewDueDate] = useState<Date | undefined>(undefined)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice; direction: 'ascending' | 'descending' }>({
    key: 'invoice_number',
    direction: 'descending'
  })

  const sortInvoices = useCallback((invoices: Invoice[]) => {
    return [...invoices].sort((a, b) => {
      if (sortConfig.key === 'invoice_number') {
        const aNumber = parseInt(a.invoice_number.split('-')[1])
        const bNumber = parseInt(b.invoice_number.split('-')[1])
        return sortConfig.direction === 'ascending' ? aNumber - bNumber : bNumber - aNumber
      }
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1
      return 0
    })
  }, [sortConfig])

  useEffect(() => {
    if (Array.isArray(invoiceHistory) && invoiceHistory.length > 0) {
      const sortedInvoices = sortInvoices(invoiceHistory)
      setFilteredInvoices(sortedInvoices)
    } else {
      setFilteredInvoices([])
    }
  }, [invoiceHistory, sortInvoices])

  useEffect(() => {
    if (Array.isArray(invoiceHistory)) {
      const filtered = invoiceHistory.filter(invoice => 
        invoice?.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      const sortedAndFiltered = sortInvoices(filtered)
      setFilteredInvoices(sortedAndFiltered)
    }
  }, [invoiceHistory, searchTerm, sortInvoices])

  const handleManualRefresh = async () => {
    setIsLoading(true)
    await handleViewInvoiceHistory(businessDetails._id)
    setIsLoading(false)
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Invalid Date'
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getStatusWithDueDate = (invoice: Invoice) => {
    if (invoice.paymentStatus === 'duedate') {
      return `due on ${formatDate(invoice.dueDate)}`
    } else if (invoice.paymentStatus === 'due') {
      return 'due'
    }
    return invoice.paymentStatus
  }

  const openExtendDateDialog = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId)
    setExtendDateDialogOpen(true)
  }

  const handleExtendDateConfirm = async () => {
    if (selectedInvoiceId && newDueDate) {
      await handleExtendDate(selectedInvoiceId, newDueDate)
      setExtendDateDialogOpen(false)
      setSelectedInvoiceId(null)
      setNewDueDate(undefined)
      await handleManualRefresh()
    }
  }

  const handleSort = (key: keyof Invoice) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
    }))
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[900px] w-[95vw] h-[90vh] overflow-hidden bg-white dark:bg-gray-900 flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Invoice History</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              All invoices generated by {businessDetails.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Search by invoice number/id ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={sortConfig.key}
                onValueChange={(value) => handleSort(value as keyof Invoice)}
              >
                <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="invoice_number" className="dark:text-gray-100">Invoice Number</SelectItem>
                  <SelectItem value="billDate" className="dark:text-gray-100">Date</SelectItem>
                  <SelectItem value="total_amount" className="dark:text-gray-100">Amount</SelectItem>
                  <SelectItem value="paymentStatus" className="dark:text-gray-100">Status</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => handleSort(sortConfig.key)}
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold py-2 px-4 border border-gray-400 dark:border-gray-600 rounded shadow"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                {sortConfig.direction === 'ascending' ? 'Asc' : 'Desc'}
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="w-full sm:w-auto bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold py-2 px-4 border border-gray-400 dark:border-gray-600 rounded shadow"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          <div className="flex-grow overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            {filteredInvoices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <AnimatePresence>
                  {filteredInvoices.map((invoice, index) => (
                    invoice && invoice.invoice_number ? (
                      <motion.div
                        key={invoice.invoice_number}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="h-full border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800 last:border-b-0">
                          <CardContent className="p-4">
                            <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">{invoice.invoice_number}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date: {formatDate(invoice.billDate)}</p>
                            <p className="text-sm font-medium mb-1 dark:text-gray-300">Amount: ₹{invoice.total_amount.toFixed(2)}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              invoice.paymentStatus === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                              invoice.paymentStatus === 'due' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                              'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                            }`}>
                              {getStatusWithDueDate(invoice)}
                            </span>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleViewInvoice(invoice)}
                              className="bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-300"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            {(invoice.paymentStatus === 'due' || invoice.paymentStatus === 'duedate') && (
                              <>
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => handleMarkPaid(invoice._id)}
                                  className="bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                                >
                                  <DollarSign className="w-4 h-4 mr-2" />
                                  Mark Paid
                                </Button>
                                <Button 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => openExtendDateDialog(invoice._id)}
                                  className="bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-800 dark:text-purple-300"
                                >
                                  {invoice.paymentStatus === 'due' ? 'Set Date' : 'Extend Date'}
                                </Button>
                              </>
                            )}
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ) : null
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {isLoading ? 'Loading invoices...' : 'No invoices found.'}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={extendDateDialogOpen} onOpenChange={setExtendDateDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Set or Extend Due Date</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Select a new due date for this invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newDueDate ? formatDate(newDueDate.toISOString()) : 'Select a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700" align="start">
                <Calendar
                  mode="single"
                  selected={newDueDate}
                  onSelect={setNewDueDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="dark:bg-gray-800 dark:text-gray-100"
                />
              </PopoverContent>
            </Popover>
            <Button 
              onClick={handleExtendDateConfirm} 
              disabled={!newDueDate}
              className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Confirm New Due Date
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}