"use client"

import { useState } from 'react'
import { ChevronDown, UserCircle, IndianRupee, Edit, Plus, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { usePDF } from 'react-to-pdf'
import { toast } from "@/hooks/use-toast"

export function InvoiceGeneratorComponentComponent() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isClientOpen, setIsClientOpen] = useState(false)
  const [isItemOpen, setIsItemOpen] = useState(false)
  const [isEditClientOpen, setIsEditClientOpen] = useState(false)
  const [isEditItemOpen, setIsEditItemOpen] = useState(false)
  const [isManageClientsOpen, setIsManageClientsOpen] = useState(false)
  const [isManageItemsOpen, setIsManageItemsOpen] = useState(false)
  const [businessDetails, setBusinessDetails] = useState({
    name: "Acme Corp",
    email: "info@acmecorp.com",
    address: "123 Business St, City, Country",
    description: "Leading provider of innovative solutions",
    gstNumber: "27AADCB2230M1Z3"
  })
  const [isEditing, setIsEditing] = useState(false)
  const [invoiceItems, setInvoiceItems] = useState([])
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, price: 0, tax: 0 })
  const [clients, setClients] = useState([
    { id: 1, name: "Client A", email: "clienta@example.com", phone: "1234567890", gstNumber: "29ABCDE1234F1Z5" },
    { id: 2, name: "Client B", email: "clientb@example.com", phone: "0987654321", gstNumber: "27FGHIJ5678K2Z3" }
  ])
  const [editingClient, setEditingClient] = useState(null)
  const [items, setItems] = useState([
    { id: 1, name: "Item 1", description: "Description for Item 1", price: 100, tax: 5 },
    { id: 2, name: "Item 2", description: "Description for Item 2", price: 200, tax: 10 },
    { id: 3, name: "Item 3", description: "Description for Item 3", price: 300, tax: 18 }
  ])
  const [editingItem, setEditingItem] = useState(null)
  const [isManualEntry, setIsManualEntry] = useState(false)
  const [isNewClient, setIsNewClient] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', gstNumber: '' })
  const [selectedClientId, setSelectedClientId] = useState('')
  const [currentInvoice, setCurrentInvoice] = useState(null)
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false)
  const [isItemwiseTax, setIsItemwiseTax] = useState(true)
  const [totalTaxRate, setTotalTaxRate] = useState(18)
  const [invoiceHistory, setInvoiceHistory] = useState([
    {
      id: 1,
      number: 'INV-001',
      client: { name: 'Client A', email: 'clienta@example.com', gstNumber: '29ABCDE1234F1Z5' },
      date: '2023-09-15',
      dueDate: '2023-10-15',
      amount: 5000,
      items: [
        { id: 1, name: 'Item 1', quantity: 2, price: 2000, tax: 5 },
        { id: 2, name: 'Item 2', quantity: 1, price: 1000, tax: 5 }
      ],
      isItemwiseTax: true,
      totalTaxRate: 5
    },
    {
      id: 2,
      number: 'INV-002',
      client: { name: 'Client B', email: 'clientb@example.com', gstNumber: '27FGHIJ5678K2Z3' },
      date: '2023-09-20',
      dueDate: '2023-10-20',
      amount: 7500,
      items: [
        { id: 1, name: 'Item 3', quantity: 1, price: 7500, tax: 18 }
      ],
      isItemwiseTax: true,
      totalTaxRate: 18
    }
  ])

  const { toPDF, targetRef } = usePDF({filename: 'invoice.pdf'})

  const handleBusinessDetailsChange = (e) => {
    setBusinessDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSaveBusinessDetails = () => {
    setIsEditing(false)
    console.log("Saving business details:", businessDetails)
  }

  const handleAddInvoiceItem = () => {
    if (newItem.name && newItem.quantity > 0 && newItem.price > 0) {
      setInvoiceItems([...invoiceItems, { ...newItem, id: Date.now() }])
      setNewItem({ name: '', quantity: 1, price: 0, tax: 0 })
    }
  }

  const handleRemoveInvoiceItem = (id) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id))
  }

  const handleEditInvoiceItem = (id, field, value) => {
    setInvoiceItems(invoiceItems.map(item => 
      item.id === id ? { ...item, [field]: field === 'price' || field === 'tax' ? parseFloat(value) : value } : item
    ))
  }

  const calculateTotal = () => {
    return invoiceItems.reduce((total, item) => {
      const itemTotal = item.quantity * item.price
      const taxAmount = isItemwiseTax ? (itemTotal * item.tax) / 100 : (itemTotal * totalTaxRate) / 100
      return total + itemTotal + taxAmount
    }, 0)
  }

  const handleAddClient = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newClient = {
      id: Date.now(),
      name: formData.get('clientName'),
      email: formData.get('clientEmail'),
      phone: formData.get('clientPhone'),
      gstNumber: formData.get('clientGstNumber')
    }
    setClients([...clients, newClient])
    setIsClientOpen(false)
  }

  const handleEditClient = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updatedClient = {
      id: editingClient.id,
      name: formData.get('clientName'),
      email: formData.get('clientEmail'),
      phone: formData.get('clientPhone'),
      gstNumber: formData.get('clientGstNumber')
    }
    setClients(clients.map(client => client.id === updatedClient.id ? updatedClient : client))
    setIsEditClientOpen(false)
    setEditingClient(null)
  }

  const handleDeleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id))
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newItem = {
      id: Date.now(),
      name: formData.get('itemName'),
      description: formData.get('itemDescription'),
      price: parseFloat(formData.get('itemPrice')),
      tax: parseFloat(formData.get('itemTax'))
    }
    setItems([...items, newItem])
    setIsItemOpen(false)
  }

  const handleEditItem = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updatedItem = {
      id: editingItem.id,
      name: formData.get('itemName'),
      description: formData.get('itemDescription'),
      price: parseFloat(formData.get('itemPrice')),
      tax: parseFloat(formData.get('itemTax'))
    }
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item))
    setIsEditItemOpen(false)
    setEditingItem(null)
  }

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleSelectItem = (itemId) => {
    const selectedItem = items.find(item => item.id.toString() === itemId)
    if (selectedItem) {
      setNewItem({ name: selectedItem.name, quantity: 1, price: selectedItem.price, tax: selectedItem.tax })
    }
  }

  const handleCreateInvoice = (e) => {
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
      id: invoiceHistory.length + 1,
      number: `INV-${Date.now()}`,
      client: isNewClient ? newClient : clients.find(c => c.id.toString() === selectedClientId),
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
    
    // Add the new invoice to the history
    setInvoiceHistory([invoiceData, ...invoiceHistory])
  }

  const handleViewInvoiceHistory = (invoice) => {
    const fullInvoice = invoiceHistory.find(inv => inv.number === invoice.number);
    if (fullInvoice) {
      setCurrentInvoice(fullInvoice);
      setIsInvoicePreviewOpen(true);
    } else {
      toast({
        title: "Error",
        description: `Invoice ${invoice.number} not found`,
        variant: "destructive",
      });
    }
  }

  const handleLogout = () => {
    console.log("Logging out...")
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      <motion.header 
        className="flex items-center justify-between h-16 px-4 border-b bg-white shrink-0 md:px-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">Welcome to Your Business Dashboard</h1>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Invoice History
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {invoiceHistory.map((invoice) => (
                <DropdownMenuItem key={invoice.id} onSelect={() => handleViewInvoiceHistory(invoice)}>
                  {invoice.number} - {invoice.client.name} (₹{invoice.amount.toFixed(2)})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                <UserCircle className="w-5 h-5" />
                {businessDetails.name}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>My Account</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Business Details</DialogTitle>
              <DialogDescription>
                View and edit your business information
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {isEditing ? (
                <form onSubmit={(e) => { e.preventDefault(); handleSaveBusinessDetails(); }}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Business Name</Label>
                      <Input id="name" name="name" value={businessDetails.name} onChange={handleBusinessDetailsChange} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={businessDetails.email} onChange={handleBusinessDetailsChange} />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" value={businessDetails.address} onChange={handleBusinessDetailsChange} />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" value={businessDetails.description} onChange={handleBusinessDetailsChange} />
                    </div>
                    <div>
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input id="gstNumber" name="gstNumber" value={businessDetails.gstNumber} onChange={handleBusinessDetailsChange} />
                    </div>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {businessDetails.name}</p>
                    <p><strong>Email:</strong> {businessDetails.email}</p>
                    <p><strong>Address:</strong> {businessDetails.address}</p>
                    <p><strong>Description:</strong> {businessDetails.description}</p>
                    <p><strong>GST Number:</strong> {businessDetails.gstNumber}</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)} className="mt-4">
                    <Edit className="mr-2 h-4 w-4" /> Edit Details
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
        <motion.div 
          className="grid gap-6 md:grid-cols-2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <CardHeader>
                <CardTitle>Total Pending Payments</CardTitle>
                <CardDescription>Amount you need to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-2xl font-bold">
                  <IndianRupee className="h-6 w-6 text-yellow-500" />
                  <span>5,000.00</span>
                </div>
              </CardContent>
            </motion.div>
          </Card>
          <Card className="overflow-hidden">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <CardHeader>
                <CardTitle>Payments to Receive</CardTitle>
                <CardDescription>Amount owed to you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-2xl font-bold">
                  <IndianRupee className="h-6 w-6 text-green-500" />
                  <span>12,500.00</span>
                </div>
              </CardContent>
            </motion.div>
          </Card>
        </motion.div>
        <motion.div 
          className="grid gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Generate Invoice</CardTitle>
              <CardDescription>Create a new invoice for your clients</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Generate Invoice</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px]">
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
                          <AnimatePresence>
                            {invoiceItems.map((item) => (
                              <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
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
                              </motion.tr>
                            ))}
                          </AnimatePresence>
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
          <Card>
            <CardHeader>
              <CardTitle>Manage Clients</CardTitle>
              <CardDescription>Add or edit client information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={isClientOpen} onOpenChange={setIsClientOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Add Client</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                      Enter the details of your new client
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddClient} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="clientName" className="text-right">
                        Name
                      </Label>
                      <Input id="clientName" name="clientName" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="clientEmail" className="text-right">
                        Email
                      </Label>
                      <Input id="clientEmail" name="clientEmail" type="email" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="clientPhone" className="text-right">
                        Phone
                      </Label>
                      <Input id="clientPhone" name="clientPhone" type="tel" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="clientGstNumber" className="text-right">
                        GST Number
                      </Label>
                      <Input id="clientGstNumber" name="clientGstNumber" className="col-span-3" />
                    </div>
                    <Button type="submit">Add Client</Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog open={isManageClientsOpen} onOpenChange={setIsManageClientsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">Manage Clients</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Manage Clients</DialogTitle>
                    <DialogDescription>
                      View, edit, or delete your clients
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>{client.name}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => { setEditingClient(client); setIsEditClientOpen(true); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteClient(client.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Items</CardTitle>
              <CardDescription>Add or edit item information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={isItemOpen} onOpenChange={setIsItemOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">Add Item</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                    <DialogDescription>
                      Enter the details of your new item
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddItem} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="itemName" className="text-right">
                        Name
                      </Label>
                      <Input id="itemName" name="itemName" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="itemDescription" className="text-right">
                        Description
                      </Label>
                      <Input id="itemDescription" name="itemDescription" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="itemPrice" className="text-right">
                        Price
                      </Label>
                      <Input id="itemPrice" name="itemPrice" type="number" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="itemTax" className="text-right">
                        Tax (%)
                      </Label>
                      <Input id="itemTax" name="itemTax" type="number" className="col-span-3" />
                    </div>
                    <Button type="submit">Add Item</Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog open={isManageItemsOpen} onOpenChange={setIsManageItemsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">Manage Items</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Manage Items</DialogTitle>
                    <DialogDescription>
                      View, edit, or delete your items
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>₹{item.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setIsEditItemOpen(true); }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update the details of your client
            </DialogDescription>
          </DialogHeader>
          {editingClient && (
            <form onSubmit={handleEditClient} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientName" className="text-right">
                  Name
                </Label>
                <Input id="clientName" name="clientName" defaultValue={editingClient.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientEmail" className="text-right">
                  Email
                </Label>
                <Input id="clientEmail" name="clientEmail" type="email" defaultValue={editingClient.email} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientPhone" className="text-right">
                  Phone
                </Label>
                <Input id="clientPhone" name="clientPhone" type="tel" defaultValue={editingClient.phone} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientGstNumber" className="text-right">
                  GST Number
                </Label>
                <Input id="clientGstNumber" name="clientGstNumber" defaultValue={editingClient.gstNumber} className="col-span-3" />
              </div>
              <Button type="submit">Update Client</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update the details of your item
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleEditItem} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemName" className="text-right">
                  Name
                </Label>
                <Input id="itemName" name="itemName" defaultValue={editingItem.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemDescription" className="text-right">
                  Description
                </Label>
                <Input id="itemDescription" name="itemDescription" defaultValue={editingItem.description} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemPrice" className="text-right">
                  Price
                </Label>
                <Input id="itemPrice" name="itemPrice" type="number" defaultValue={editingItem.price} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemTax" className="text-right">
                  Tax (%)
                </Label>
                <Input id="itemTax" name="itemTax" type="number" defaultValue={editingItem.tax} className="col-span-3" />
              </div>
              <Button type="submit">Update Item</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isInvoicePreviewOpen} onOpenChange={setIsInvoicePreviewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogDescription>
              Review your invoice before finalizing
            </DialogDescription>
          </DialogHeader>
          {currentInvoice && (
            <div ref={targetRef} className="p-6 bg-white rounded-lg shadow-lg">
              <div className="flex justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{businessDetails.name}</h2>
                  <p>{businessDetails.address}</p>
                  <p>GST: {businessDetails.gstNumber}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-semibold mb-2">Invoice</h3>
                  <p>Invoice #: {currentInvoice.number}</p>
                  <p>Date: {currentInvoice.date}</p>
                  <p>Due Date: {currentInvoice.dueDate}</p>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
                <p>{currentInvoice.client.name}</p>
                <p>{currentInvoice.client.email}</p>
                <p>GST: {currentInvoice.client.gstNumber}</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    {currentInvoice.isItemwiseTax && <TableHead className="text-right">Tax (%)</TableHead>}
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentInvoice.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                      {currentInvoice.isItemwiseTax && <TableCell className="text-right">{item.tax}%</TableCell>}
                      <TableCell className="text-right">
                        ₹{((item.quantity * item.price) * (1 + (currentInvoice.isItemwiseTax ? item.tax : currentInvoice.totalTaxRate) / 100)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-8 text-right">
                <p className="text-lg font-semibold">Total: ₹{currentInvoice.amount.toFixed(2)}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => toPDF()}>Download PDF</Button>
            <Button onClick={() => setIsInvoicePreviewOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}