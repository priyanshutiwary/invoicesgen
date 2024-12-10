'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Client {
  _id: string
  name: string
  contact: string
  gst_number: string
}

interface Item {
  _id: string
  name: string
  price: number
  tax: number
}

interface InvoiceItem {
  _id: string
  name: string
  quantity: number
  price: number
  tax: number
}

interface Invoice {
  invoice_id: string
  clientStatus:string
  clientId: string
  items: InvoiceItem[]
  total: number
  paymentStatus: 'paid' | 'due' | 'duedate'
  dueDate?: string
  billDate: string
  isItemwiseTax: boolean
  totalTaxRate: number
  client: Client
}

interface InvoiceData {
  invoice_id: string
  clientId: string
  isNewClient: boolean
  newClient: { name: string; contact: string; gstNumber: string }
  isItemwiseTax: boolean
  totalTaxRate: number
  paymentStatus: 'paid' | 'due' | 'duedate'
  dueDate: string
  billDate: string
  total: number
}

interface InvoiceGenerationProps {
  isInvoiceOpen: boolean
  setIsInvoiceOpen: React.Dispatch<React.SetStateAction<boolean>>
  invoiceItems: InvoiceItem[]
  setInvoiceItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>
  clients: Client[]
  items: Item[]
  setCurrentInvoice: React.Dispatch<React.SetStateAction<Invoice | null>>
  setIsInvoicePreviewOpen: React.Dispatch<React.SetStateAction<boolean>>
  invoiceData: InvoiceData
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>
  setIsViewHistoryInvoice: React.Dispatch<React.SetStateAction<boolean>>
}

export function InvoiceGeneration({
  isInvoiceOpen,
  setIsInvoiceOpen,
  invoiceItems,
  setInvoiceItems,
  clients,
  items,
  setCurrentInvoice,
  setIsInvoicePreviewOpen,
  invoiceData,
  setInvoiceData,
  setIsViewHistoryInvoice,
}: InvoiceGenerationProps) {
  const [isNewClient, setIsNewClient] = useState(invoiceData.isNewClient)
  const [newClient, setNewClient] = useState(invoiceData.newClient)
  const [selectedClientId, setSelectedClientId] = useState(invoiceData.clientId)
  const [isItemwiseTax, setIsItemwiseTax] = useState(invoiceData.isItemwiseTax)
  const [totalTaxRate, setTotalTaxRate] = useState(invoiceData.totalTaxRate)
  const [isManualEntry, setIsManualEntry] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'due' | 'duedate'>(invoiceData.paymentStatus)
  const [dueDate, setDueDate] = useState(invoiceData.dueDate)
  const [billDate, setBillDate] = useState(invoiceData.billDate)

  useEffect(() => {
    setIsNewClient(invoiceData.isNewClient)
    setNewClient(invoiceData.newClient)
    setSelectedClientId(invoiceData.clientId)
    setIsItemwiseTax(invoiceData.isItemwiseTax)
    setTotalTaxRate(invoiceData.totalTaxRate)
    setPaymentStatus(invoiceData.paymentStatus)
    setDueDate(invoiceData.dueDate)
    setBillDate(invoiceData.billDate)
  }, [invoiceData])

  const handleAddInvoiceItem = useCallback(() => {
    if (selectedItem && itemQuantity > 0) {
      const itemId = selectedItem._id || `temp-${Date.now()}`
      const existingItem = invoiceItems.find((item) => item._id === itemId)

      if (existingItem) {
        toast({
          title: 'Item already added',
          description: `${selectedItem.name} is already in the invoice. You can adjust its quantity instead.`,
          variant: 'destructive',
        })
        return
      }

      setInvoiceItems((prev) => [
        ...prev,
        {
          _id: itemId,
          name: selectedItem.name,
          quantity: itemQuantity,
          price: selectedItem.price,
          tax: selectedItem.tax || 0,
        },
      ])
      setSelectedItem(null)
      setItemQuantity(1)
    } else {
      toast({
        title: 'Invalid item',
        description: 'Please select an item and ensure quantity is greater than 0.',
        variant: 'destructive',
      })
    }
  }, [selectedItem, itemQuantity, setInvoiceItems, invoiceItems])

  const handleRemoveInvoiceItem = useCallback((id: string) => {
    setInvoiceItems((prev) => prev.filter((item) => item._id !== id))
  }, [setInvoiceItems])

  const handleClearAllItems = useCallback(() => {
    setInvoiceItems([])
  }, [setInvoiceItems])

  const handleEditInvoiceItem = useCallback((id: string, field: string, value: string | number) => {
    setInvoiceItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              [field]: field === 'price' || field === 'tax' ? parseFloat(value as string) : parseInt(value as string),
            }
          : item
      )
    )
  }, [setInvoiceItems])

  const calculateTotal = useCallback(() => {
    return invoiceItems.reduce((total, item) => {
      const itemTotal = item.quantity * item.price
      const taxAmount = isItemwiseTax
        ? (itemTotal * (item.tax || 0)) / 100
        : (itemTotal * totalTaxRate) / 100
      return total + itemTotal + taxAmount
    }, 0)
  }, [invoiceItems, isItemwiseTax, totalTaxRate])

  const handleSelectItem = useCallback((itemId: string) => {
    const item = items.find((item) => item._id === itemId)
    if (item) {
      setSelectedItem(item)
      setItemQuantity(1)
    }
  }, [items])

  const handleCreateInvoice = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const phoneRegex = /^[0-9]{10}$/;
    if (isNewClient && !phoneRegex.test(newClient.contact)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid phone number (10 digits). Example: 1234567890',
        variant: 'destructive',
      })
      return
    }

    const gstRegex = /^[0-9]{2}[A-Z]{4}[0-9]{4}[A-Z][0-9A-Z]{3}$/;
    if (isNewClient && !gstRegex.test(newClient.gstNumber)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid GST number. Example: 12ABCDE1234F1Z5',
        variant: 'destructive',
      })
      return
    }

    if (!selectedClientId && !isNewClient) {
      toast({
        title: 'Error',
        description: 'Please select a client or add a new one.',
        variant: 'destructive',
      })
      return
    }

    if (isNewClient && (!newClient.name || !newClient.contact)) {
      toast({
        title: 'Error',
        description: 'Please fill in all required client information.',
        variant: 'destructive',
      })
      return
    }

    if (paymentStatus === 'duedate' && !dueDate) {
      toast({
        title: 'Error',
        description: 'Please select a due date.',
        variant: 'destructive',
      })
      return
    }

    if (invoiceItems.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one item to the invoice.',
        variant: 'destructive',
      })
      return
    }

    const matchingClient = clients.find((client) => client._id === selectedClientId)

    const invoiceData: Invoice = {
      invoice_id: Date.now().toString(),
      clientStatus: isNewClient ? "new": "existing",
      clientId: isNewClient ? '' : selectedClientId,
      items: invoiceItems,
      total: calculateTotal(),
      paymentStatus: paymentStatus,
      dueDate: paymentStatus === 'duedate' ? dueDate : undefined,
      billDate: billDate,
      isItemwiseTax: isItemwiseTax,
      totalTaxRate: totalTaxRate,
      client: isNewClient ? {
        _id: `new-${Date.now()}`,
        name: newClient.name,
        contact: newClient.contact,
        gst_number: newClient.gstNumber
      } : matchingClient,
    }
    console.log("invoice data",invoiceData);
    
    setCurrentInvoice(invoiceData)
    setIsInvoiceOpen(false)
    setIsInvoicePreviewOpen(true)
    setIsViewHistoryInvoice(false)

    setInvoiceData({
      invoice_id: Date.now().toString(),
      clientId: selectedClientId,
      isNewClient: isNewClient,
      newClient: newClient,
      isItemwiseTax: isItemwiseTax,
      totalTaxRate: totalTaxRate,
      paymentStatus: paymentStatus,
      dueDate: dueDate,
      billDate: billDate,
      total: calculateTotal(),
    })
  }, [
    selectedClientId,
    isNewClient,
    newClient,
    invoiceItems,
    calculateTotal,
    isItemwiseTax,
    totalTaxRate,
    paymentStatus,
    dueDate,
    billDate,
    setCurrentInvoice,
    setIsInvoiceOpen,
    setIsInvoicePreviewOpen,
    setInvoiceData,
    clients,
  ])

  const handleClearForm = useCallback(() => {
    setIsNewClient(false)
    setNewClient({ name: '', contact: '', gstNumber: '' })
    setSelectedClientId('')
    setInvoiceItems([])
    setSelectedItem(null)
    setItemQuantity(1)
    setIsItemwiseTax(false)
    setTotalTaxRate(0)
    setPaymentStatus('due')
    setDueDate('')

    setInvoiceData({
      invoice_id: '',
      clientId: '',
      isNewClient: false,
      newClient: { name: '', contact: '', gstNumber: '' },
      isItemwiseTax: false,
      totalTaxRate: 0,
      paymentStatus: 'due',
      dueDate: '',
      billDate: new Date().toISOString().split('T')[0],
      total: 0,
    })
  }, [setInvoiceData, setInvoiceItems])

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-bold text-blue-800 dark:text-blue-400">Generate Invoice</CardTitle>
        <CardDescription className="text-sm md:text-base text-blue-600 dark:text-blue-300">Create a new invoice for your clients</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white">
              Generate Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] max-h-[90vh] overflow-auto dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl dark:text-blue-400">Generate New Invoice</DialogTitle>
              <DialogDescription className="text-sm md:text-base dark:text-blue-300">Fill in the details to create a new invoice</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateInvoice} className="space-y-4 md:space-y-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg dark:text-blue-400">Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="new-client"
                      checked={isNewClient}
                      onCheckedChange={(checked) => {
                        setIsNewClient(checked)
                        setInvoiceData((prev) => ({ ...prev, isNewClient: checked }))
                      }}
                    />
                    <Label htmlFor="new-client" className="text-sm md:text-base dark:text-gray-200">New Client</Label>
                  </div>
                  {isNewClient ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Name"
                        value={newClient.name}
                        onChange={(e) => {
                          setNewClient({ ...newClient, name: e.target.value })
                          setInvoiceData((prev) => ({
                            ...prev,
                            newClient: { ...prev.newClient, name: e.target.value },
                          }))
                        }}
                        className="dark:bg-gray-800 dark:border-gray-700"
                      />
                      <Input
                        placeholder="Contact"
                        value={newClient.contact}
                        onChange={(e) => {
                          setNewClient({ ...newClient, contact: e.target.value })
                          setInvoiceData((prev) => ({
                            ...prev,
                            newClient: { ...prev.newClient, contact: e.target.value },
                          }))
                        }}
                        className="dark:bg-gray-800 dark:border-gray-700"
                      />
                      <Input
                        placeholder="GST Number"
                        value={newClient.gstNumber}
                        onChange={(e) => {
                          setNewClient({ ...newClient, gstNumber: e.target.value })
                          setInvoiceData((prev) => ({
                            ...prev,
                            newClient: { ...prev.newClient, gstNumber: e.target.value },
                          }))
                        }}
                        className="dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>
                  ) : (
                    <Select
                      value={selectedClientId}
                      onValueChange={(value) => {
                        setSelectedClientId(value)
                        setInvoiceData((prev) => ({ ...prev, clientId: value }))
                      }}
                    >
                      <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800">
                        {clients && clients.length > 0 ? (
                          clients.map((client) =>
                            client && client._id ? (
                              <SelectItem key={client._id} value={client._id}>
                                {client.name}
                              </SelectItem>
                            ) : null
                          )
                        ) : (
                          <p>No clients available</p>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg dark:text-blue-400">Invoice Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="itemwise-tax"
                        checked={isItemwiseTax}
                        onCheckedChange={(checked) => {
                          setIsItemwiseTax(checked)
                          setInvoiceData((prev) => ({ ...prev, isItemwiseTax: checked }))
                        }}
                      />
                      <Label htmlFor="itemwise-tax" className="text-sm md:text-base dark:text-gray-200">Itemwise Tax</Label>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllItems}
                      className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Clear All
                    </Button>
                  </div>
                  {!isItemwiseTax && (
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="totalTaxRate" className="text-sm md:text-base dark:text-gray-200">Total Tax Rate (%)</Label>
                      <Input
                        id="totalTaxRate"
                        type="number"
                        value={totalTaxRate}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value)
                          setTotalTaxRate(value)
                          setInvoiceData((prev) => ({ ...prev, totalTaxRate: value }))
                        }}
                        className="w-20 dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="dark:bg-gray-800">
                          <TableHead className="text-xs md:text-sm dark:text-gray-200">Name</TableHead>
                          <TableHead className="text-xs md:text-sm dark:text-gray-200">Quantity</TableHead>
                          <TableHead className="text-xs md:text-sm dark:text-gray-200">Price</TableHead>
                          {isItemwiseTax && <TableHead className="text-xs md:text-sm dark:text-gray-200">Tax (%)</TableHead>}
                          <TableHead className="text-xs md:text-sm dark:text-gray-200">Total</TableHead>
                          <TableHead className="text-xs md:text-sm dark:text-gray-200"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoiceItems.map((item) => (
                          <TableRow key={item._id} className="dark:hover:bg-gray-700">
                            <TableCell className="text-xs md:text-sm dark:text-gray-300">{item.name}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleEditInvoiceItem(item._id, 'quantity', e.target.value)}
                                className="w-16 md:w-20 text-xs md:text-sm dark:bg-gray-800 dark:border-gray-700"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.price}
                                onChange={(e) => handleEditInvoiceItem(item._id, 'price', e.target.value)}
                                className="w-20 md:w-24 text-xs md:text-sm dark:bg-gray-800 dark:border-gray-700"
                              />
                            </TableCell>
                            {isItemwiseTax && (
                              <TableCell>
                                <Input
                                  type="number"
                                  value={item.tax || 0}
                                  onChange={(e) => handleEditInvoiceItem(item._id, 'tax', e.target.value)}
                                  className="w-16 md:w-20 text-xs md:text-sm dark:bg-gray-800 dark:border-gray-700"
                                />
                              </TableCell>
                            )}
                            <TableCell className="text-xs md:text-sm dark:text-gray-300">
                              ₹
                              {(
                                item.quantity *
                                item.price *
                                (1 + (isItemwiseTax ? item.tax || 0 : totalTaxRate) / 100)
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveInvoiceItem(item._id)}
                                className="dark:hover:bg-gray-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="manual-entry"
                      checked={isManualEntry}
                      onCheckedChange={setIsManualEntry}
                    />
                    <Label htmlFor="manual-entry" className="text-sm md:text-base dark:text-gray-200">Manual Entry</Label>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-end gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 w-full md:flex-grow">
                      {isManualEntry ? (
                        <Input
                          placeholder="Item name"
                          value={selectedItem?.name || ''}
                          onChange={(e) =>
                            setSelectedItem((prev) =>
                              prev ? { ...prev, name: e.target.value } : { _id: `temp-${Date.now()}`, name: e.target.value, price: 0, tax: 0 }
                            )
                          }
                          className="text-xs md:text-sm dark:bg-gray-800 dark:border-gray-700"
                        />
                      ) : (
                        <Select onValueChange={handleSelectItem}>
                          <SelectTrigger className="text-xs md:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                            <SelectValue placeholder="Select an item" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800">
                            {items && items.length > 0 ? (
                              items.map((item) =>
                                item && item._id ? (
                                  <SelectItem key={item._id} value={item._id}>
                                    {item.name}
                                  </SelectItem>
                                ) : null
                              )
                            ) : (
                              <p>No items available</p>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(parseInt(e.target.value))}
                        className="text-xs md:text-sm dark:bg-gray-800 dark:border-gray-700"
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={selectedItem?.price || ''}
                        onChange={(e) =>
                          setSelectedItem((prev) =>
                            prev ? { ...prev, price: parseFloat(e.target.value) } : { _id: `temp-${Date.now()}`, name: '', price: parseFloat(e.target.value), tax: 0 }
                          )
                        }
                        readOnly={!isManualEntry}
                        className="text-xs md:text-sm dark:bg-gray-800 dark:border-gray-700"
                      />
                      {isItemwiseTax && (
                        <Input
                          type="number"
                          placeholder="Tax (%)"
                          value={selectedItem?.tax || 0}
                          onChange={(e) =>
                            setSelectedItem((prev) =>
                              prev ? { ...prev, tax: parseFloat(e.target.value) } : { _id: `temp-${Date.now()}`, name: '', price: 0, tax: parseFloat(e.target.value) }
                            )
                          }
                          readOnly={!isManualEntry}
                          className="text-xs md:text-sm dark:bg-gray-800 dark:border-gray-700"
                        />
                      )}
                      <Button type="button" onClick={handleAddInvoiceItem} className="w-full md:w-auto dark:bg-blue-700 dark:hover:bg-blue-600">
                        <Plus className="h-4 w-4 mr-2" /> Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg dark:text-blue-400">Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm md:text-base dark:text-gray-200">Payment Status</Label>
                    <RadioGroup
                      value={paymentStatus}
                      onValueChange={(value: 'paid' | 'due' | 'duedate') => {
                        setPaymentStatus(value)
                        setInvoiceData((prev) => ({ ...prev, paymentStatus: value }))
                      }}
                      className="dark:text-gray-200"
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paid" id="paid" />
                          <Label htmlFor="paid" className="text-sm md:text-base dark:text-gray-200">Paid</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="due" id="due" />
                          <Label htmlFor="due" className="text-sm md:text-base dark:text-gray-200">Due</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="duedate" id="duedate" />
                          <Label htmlFor="duedate" className="text-sm md:text-base dark:text-gray-200">Due Date</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  {paymentStatus === 'duedate' && (
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                      <Label htmlFor="dueDate" className="text-sm md:text-base dark:text-gray-200">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => {
                          setDueDate(e.target.value)
                          setInvoiceData((prev) => ({ ...prev, dueDate: e.target.value }))
                        }}
                        className="w-full md:w-auto text-xs md:text-sm dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    <Label htmlFor="billDate" className="text-sm md:text-base dark:text-gray-200">Bill Generation Date</Label>
                    <Input
                      id="billDate"
                      type="date"
                      value={billDate}
                      onChange={(e) => {
                        setBillDate(e.target.value)
                        setInvoiceData((prev) => ({ ...prev, billDate: e.target.value }))
                      }}
                      className="w-full md:w-auto text-xs md:text-sm dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-base md:text-lg font-semibold dark:text-gray-200">
                  Total: ₹{calculateTotal().toFixed(2)}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleClearForm}
                    className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Clear
                  </Button>
                  <Button 
                    type="submit"
                    className="dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    Create Invoice
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default InvoiceGeneration