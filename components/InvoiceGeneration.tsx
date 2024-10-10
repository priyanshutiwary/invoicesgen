import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Client {
  id: number; // Change this from string to number
  name: string;
  email: string;
  phone: string;
  gstNumber: string;
}

interface Item {
  id: string;
  name: string;
  price: number;
}

interface InvoiceItem extends Item {
  quantity: number;
}

interface Invoice {
  // Define the structure of your invoice here
  // For example:
  id: string;
  clientId: string;
  items: InvoiceItem[];
  total: number;
  // Add other necessary fields
}

interface InvoiceGenerationProps {
  isInvoiceOpen: boolean;
  setIsInvoiceOpen: React.Dispatch<React.SetStateAction<boolean>>;
  invoiceItems: InvoiceItem[];
  setInvoiceItems: React.Dispatch<React.SetStateAction<InvoiceItem[]>>;
  clients: Client[];
  items: Item[];
  setCurrentInvoice: React.Dispatch<React.SetStateAction<Invoice | null>>;
  setIsInvoicePreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function InvoiceGeneration({ 
  isInvoiceOpen, 
  setIsInvoiceOpen, 
  invoiceItems, 
  setInvoiceItems, 
  clients, 
  items, 
  setCurrentInvoice, 
  setIsInvoicePreviewOpen 
}: InvoiceGenerationProps) {
  const [isNewClient, setIsNewClient] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', gstNumber: '' })
  const [selectedClientId, setSelectedClientId] = useState('')
  const [isItemwiseTax, setIsItemwiseTax] = useState(true)
  const [totalTaxRate, setTotalTaxRate] = useState(18)
  const [isManualEntry, setIsManualEntry] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, price: 0, tax: 0 })

  const handleAddInvoiceItem = useCallback(() => {
    if (newItem.name && newItem.quantity > 0 && newItem.price > 0) {
      setInvoiceItems(prev => [...prev, { ...newItem, id: Date.now() }])
      setNewItem({ name: '', quantity: 1, price: 0, tax: 0 })
    }
  }, [newItem, setInvoiceItems])

  const handleRemoveInvoiceItem = useCallback((id) => {
    setInvoiceItems(prev => prev.filter(item => item.id !== id))
  }, [setInvoiceItems])

  const handleEditInvoiceItem = useCallback((id, field, value) => {
    setInvoiceItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: field === 'price' || field === 'tax' ? parseFloat(value) : value } : item
    ))
  }, [setInvoiceItems])

  const calculateTotal = useCallback(() => {
    return invoiceItems.reduce((total, item) => {
      const itemTotal = item.quantity * item.price
      const taxAmount = isItemwiseTax ? (itemTotal * item.tax) / 100 : (itemTotal * totalTaxRate) / 100
      return total + itemTotal + taxAmount
    }, 0)
  }, [invoiceItems, isItemwiseTax, totalTaxRate])

  const handleSelectItem = useCallback((itemId) => {
    const selectedItem = items.find(item => item.id.toString() === itemId)
    if (selectedItem) {
      setNewItem({ name: selectedItem.name, quantity: 1, price: selectedItem.price, tax: selectedItem.tax })
    }
  }, [items])

  const handleCreateInvoice = useCallback((e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const currentDate = new Date().toISOString().split('T')[0]
    const dueDate = formData.get('dueDate')

    if (!selectedClientId && !isNewClient) {
      toast({
        title: "Error",
        description: "Please select a client or add a new one.",
        variant: "destructive",
      })
      return
    }

    if (isNewClient && (!newClient.name || !newClient.email)) {
      toast({
        title: "Error",
        description: "Please fill in all required client information.",
        variant: "destructive",
      })
      return
    }

    if (!dueDate) {
      toast({
        title: "Error",
        description: "Please select a due date.",
        variant: "destructive",
      })
      return
    }

    if (invoiceItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the invoice.",
        variant: "destructive",
      })
      return
    }

    const invoiceData = {
      id: Date.now(),
      number: `INV-${Date.now()}`,
      client: isNewClient ? newClient : clients.find(c => c.id === parseInt(selectedClientId)),
      date: currentDate,
      dueDate: dueDate,
      items: invoiceItems,
      amount: calculateTotal(),
      isItemwiseTax: isItemwiseTax,
      totalTaxRate: totalTaxRate
    }
    setCurrentInvoice(invoiceData)
    setIsInvoiceOpen(false)
    setIsInvoicePreviewOpen(true)

    // After setting the current invoice and closing the dialog, reset the form fields
    setIsNewClient(false)
    setNewClient({ name: '', email: '', phone: '', gstNumber: '' })
    setSelectedClientId('')
    setIsItemwiseTax(true)
    setTotalTaxRate(18)
    setIsManualEntry(false)
    setNewItem({ name: '', quantity: 1, price: 0, tax: 0 })
    setInvoiceItems([]) // Reset the invoice items
  }, [selectedClientId, isNewClient, newClient, invoiceItems, calculateTotal, isItemwiseTax, totalTaxRate, clients, setCurrentInvoice, setIsInvoiceOpen, setIsInvoicePreviewOpen])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Generate Invoice</CardTitle>
        <CardDescription>Create a new invoice for your clients</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Generate Invoice</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Generate New Invoice</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new invoice
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateInvoice} className="grid gap-4 py-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="new-client">New Client</Label>
                <Switch
                  id="new-client"
                  checked={isNewClient}
                  onCheckedChange={setIsNewClient}
                />
              </div>
              {isNewClient ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="clientName" className="text-right">Name</Label>
                    <Input 
                      id="clientName" 
                      value={newClient.name}
                      onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="clientEmail" className="text-right">Email</Label>
                    <Input 
                      id="clientEmail" 
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="clientPhone" className="text-right">Phone</Label>
                    <Input 
                      id="clientPhone" 
                      type="tel"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="clientGstNumber" className="text-right">GST Number</Label>
                    <Input 
                      id="clientGstNumber" 
                      value={newClient.gstNumber}
                      onChange={(e) => setNewClient({...newClient, gstNumber: e.target.value})}
                      className="col-span-3" 
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client" className="text-right">
                    Client
                  </Label>
                  <Select onValueChange={setSelectedClientId}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input id="dueDate" name="dueDate" type="date" className="col-span-3" />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="itemwise-tax">Itemwise Tax</Label>
                <Switch
                  id="itemwise-tax"
                  checked={isItemwiseTax}
                  onCheckedChange={setIsItemwiseTax}
                />
              </div>
              {!isItemwiseTax && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalTaxRate" className="text-right">
                    Total Tax Rate (%)
                  </Label>
                  <Input
                    id="totalTaxRate"
                    type="number"
                    value={totalTaxRate}
                    onChange={(e) => setTotalTaxRate(parseFloat(e.target.value))}
                    className="col-span-3"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Items</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      {isItemwiseTax && <TableHead>Tax (%)</TableHead>}
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleEditInvoiceItem(item.id, 'quantity', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleEditInvoiceItem(item.id, 'price', e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                        {isItemwiseTax && (
                          <TableCell>
                            <Input
                              type="number"
                              value={item.tax}
                              onChange={(e) => handleEditInvoiceItem(item.id, 'tax', e.target.value)}
                              className="w-20"
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          ₹{((item.quantity * item.price) * (1 + (isItemwiseTax ? item.tax : totalTaxRate) / 100)).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveInvoiceItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="manual-entry">Manual Entry</Label>
                  <Switch
                    id="manual-entry"
                    checked={isManualEntry}
                    onCheckedChange={setIsManualEntry}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="grid grid-cols-5 gap-2 flex-grow">
                    {isManualEntry ? (
                      <Input
                        placeholder="Item name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      />
                    ) : (
                      <Select onValueChange={handleSelectItem}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an item" />
                        </SelectTrigger>
                        <SelectContent>
                          {items.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Input 
                      type="number" 
                      placeholder="Quantity" 
                      value={newItem.quantity} 
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                    />
                    <Input 
                      type="number" 
                      placeholder="Price" 
                      value={newItem.price} 
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                    />
                    {isItemwiseTax && (
                      <Input 
                        type="number" 
                        placeholder="Tax (%)" 
                        value={newItem.tax} 
                        onChange={(e) => setNewItem({...newItem, tax: parseFloat(e.target.value)})}
                      />
                    )}
                    <Button type="button" onClick={handleAddInvoiceItem}>
                      <Plus className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-right font-bold">
                Total: ₹{calculateTotal().toFixed(2)}
              </div>
              <Button type="submit">Create Invoice</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}