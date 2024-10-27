
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, ChevronLeft, ChevronRight, Eye, DollarSign, CalendarIcon, ArrowUpDown } from "lucide-react"
import { Invoice, BusinessDetails } from '@/backend/types/type'

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
  const [currentPage, setCurrentPage] = useState(1)
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

  const itemsPerPage = 5

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
      setCurrentPage(1)
    }
  }, [invoiceHistory, searchTerm, sortInvoices])

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex)

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))

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
        <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Invoice History</DialogTitle>
            <DialogDescription className="text-gray-600">
              All invoices generated by {businessDetails.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by invoice number/id ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={sortConfig.key}
                  onValueChange={(value) => handleSort(value as keyof Invoice)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice_number">Invoice Number</SelectItem>
                    <SelectItem value="billDate">Date</SelectItem>
                    <SelectItem value="total_amount">Amount</SelectItem>
                    <SelectItem value="paymentStatus">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => handleSort(sortConfig.key)}
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  {sortConfig.direction === 'ascending' ? 'Asc' : 'Desc'}
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleManualRefresh}
                disabled={isLoading}
                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
            {filteredInvoices.length > 0 ? (
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] bg-gray-50 text-gray-600">Invoice</TableHead>
                      <TableHead className="w-[100px] bg-gray-50 text-gray-600">Date</TableHead>
                      <TableHead className="w-[100px] bg-gray-50 text-gray-600">Amount</TableHead>
                      <TableHead className="w-[100px] bg-gray-50 text-gray-600">Status</TableHead>
                      <TableHead className="w-[200px] bg-gray-50 text-gray-600">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentInvoices.map((invoice) => (
                      invoice && invoice.invoice_number ? (
                        <TableRow key={invoice.invoice_number} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-gray-900">{invoice.invoice_number}</TableCell>
                          <TableCell className="text-gray-600">{formatDate(invoice.billDate)}</TableCell>
                          <TableCell className="text-gray-900">₹{invoice.total_amount.toFixed(2)}</TableCell>
                          <TableCell className="text-gray-600">{getStatusWithDueDate(invoice)}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => handleViewInvoice(invoice)}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-800"
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
                                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                                  >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Mark Paid
                                  </Button>
                                  <Button 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={() => openExtendDateDialog(invoice._id)}
                                    className="bg-purple-100 hover:bg-purple-200 text-purple-800"
                                  >
                                    {invoice.paymentStatus === 'due' ? 'Set Date' : 'Extend Date'}
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : null
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-600 text-lg">
                  {isLoading ? 'Loading invoices...' : 'No invoices found.'}
                </p>
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
              <span className="text-gray-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={extendDateDialogOpen} onOpenChange={setExtendDateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Set or Extend Due Date</DialogTitle>
            <DialogDescription className="text-gray-600">
              Select a new due date for this invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newDueDate ? formatDate(newDueDate.toISOString()) : 'Select a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                
                <Calendar
                  mode="single"
                  selected={newDueDate}
                  onSelect={setNewDueDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button 
              onClick={handleExtendDateConfirm} 
              disabled={!newDueDate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirm New Due Date
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}