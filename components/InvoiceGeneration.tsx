import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface Client {
  _id: string
  name: string
  contact: string
  gstNumber: string
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
  setIsViewHistoryInvoice
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
  useEffect(() => {
    // Update local state when invoiceData changes
    setIsNewClient(invoiceData.isNewClient)
    setNewClient(invoiceData.newClient)
    setSelectedClientId(invoiceData.clientId)
    setIsItemwiseTax(invoiceData.isItemwiseTax)
    setTotalTaxRate(invoiceData.totalTaxRate)
    setPaymentStatus(invoiceData.paymentStatus)
    setDueDate(invoiceData.dueDate)
    setBillDate(invoiceData.billDate)
  }, [invoiceData])

  const [isNewClient, setIsNewClient] = React.useState(invoiceData.isNewClient)
  const [newClient, setNewClient] = React.useState(invoiceData.newClient)
  const [selectedClientId, setSelectedClientId] = React.useState(invoiceData.clientId)
  const [isItemwiseTax, setIsItemwiseTax] = React.useState(invoiceData.isItemwiseTax)
  const [totalTaxRate, setTotalTaxRate] = React.useState(invoiceData.totalTaxRate)
  const [isManualEntry, setIsManualEntry] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null)
  const [itemQuantity, setItemQuantity] = React.useState(1)
  const [paymentStatus, setPaymentStatus] = React.useState<'paid' | 'due' | 'duedate'>(invoiceData.paymentStatus)
  const [dueDate, setDueDate] = React.useState(invoiceData.dueDate)
  const [billDate, setBillDate] = React.useState(invoiceData.billDate)


  const handleAddInvoiceItem = React.useCallback(() => {
    if (selectedItem && itemQuantity > 0) {
      // Check if selectedItem has an _id, if not, generate a temporary one
      const itemId = selectedItem._id || `temp-${Date.now()}`
      
      const existingItem = invoiceItems.find(
        (item) => item._id === itemId
      )
      
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
  // const handleAddInvoiceItem = React.useCallback(() => {
  //   if (selectedItem && itemQuantity > 0) {
  //     const existingItem = invoiceItems.find(
  //       (item) => item.name === selectedItem.name
  //     )
  //     if (existingItem) {
  //       toast({
  //         title: 'Item already added',
  //         description: `${selectedItem.name} is already in the invoice. You can adjust its quantity instead.`,
  //         variant: 'destructive',
  //       })
  //       return
  //     }
  //     setInvoiceItems((prev) => [
  //       ...prev,
  //       {
  //         _id: Date.now().toString(),
  //         name: selectedItem.name,
  //         quantity: itemQuantity,
  //         price: selectedItem.price,
  //         tax: selectedItem.tax || 0,
  //       },
  //     ])
  //     setSelectedItem(null)
  //     setItemQuantity(1)
  //   }
  // }, [selectedItem, itemQuantity, setInvoiceItems, invoiceItems])

  const handleRemoveInvoiceItem = React.useCallback(
    (id: string) => {
      setInvoiceItems((prev) => prev.filter((item) => item._id !== id))
    },
    [setInvoiceItems]
  )

  const handleClearAllItems = React.useCallback(() => {
    setInvoiceItems([])
  }, [setInvoiceItems])

  const handleEditInvoiceItem = React.useCallback(
    (id: string, field: string, value: string | number) => {
      setInvoiceItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                [field]:
                  field === 'price' || field === 'tax'
                    ? parseFloat(value as string)
                    : parseInt(value as string),
              }
            : item
        )
      )
    },
    [setInvoiceItems]
  )

  const calculateTotal = React.useCallback(() => {
    return invoiceItems.reduce((total, item) => {
      const itemTotal = item.quantity * item.price
      const taxAmount = isItemwiseTax
        ? (itemTotal * (item.tax || 0)) / 100
        : (itemTotal * totalTaxRate) / 100
      return total + itemTotal + taxAmount
    }, 0)
  }, [invoiceItems, isItemwiseTax, totalTaxRate])

  const handleSelectItem = React.useCallback(
    (itemId: string) => {
      const item = items.find((item) => item._id === itemId)
      if (item) {
        setSelectedItem(item)
        setItemQuantity(1)
      }
    },
    [items]
  )

  const handleCreateInvoice = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

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
      const matchingClient = clients.find(clients => clients._id === selectedClientId);

      const invoiceData: Invoice = {
        invoice_id: Date.now().toString(),
        clientId: isNewClient ? 'new' : selectedClientId,
        items: invoiceItems,
        total: calculateTotal(),
        paymentStatus: paymentStatus,
        dueDate: paymentStatus === 'duedate' ? dueDate : undefined,
        billDate: billDate,
        isItemwiseTax: isItemwiseTax,
        totalTaxRate: totalTaxRate,
        client:matchingClient
      }
      setCurrentInvoice(invoiceData)
      setIsInvoiceOpen(false)
      setIsInvoicePreviewOpen(true)
      setIsViewHistoryInvoice(false)
      
      // Update invoiceData state
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
        total:0,
      })
    },
    [
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
    ]
  )
  const handleClearForm = () => {
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
      invoice_id:"",
      clientId: '',
      isNewClient: false,
      newClient: { name: '', contact: '', gstNumber: '' },
      isItemwiseTax: false,
      totalTaxRate: 0,
      paymentStatus: 'due',
      dueDate: '',
      billDate: new Date().toISOString().split('T')[0],
      total:0,
    })
  }


  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-800">Generate Invoice</CardTitle>
        <CardDescription className="text-blue-600">Create a new invoice for your clients</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Generate Invoice</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Generate New Invoice</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new invoice
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateInvoice} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Client Information</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-client"
                    checked={isNewClient}
                    onCheckedChange={(checked) => {
                      setIsNewClient(checked)
                      setInvoiceData((prev) => ({ ...prev, isNewClient: checked }))
                    }}
                  />
                  <Label htmlFor="new-client">New Client</Label>
                </div>
                {isNewClient ? (
                  <div className="grid grid-cols-2 gap-4">
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients && clients.length > 0 ? (
                        clients.map((client) => (
                          <SelectItem key={client._id} value={client._id}>
                            {client.name}
                          </SelectItem>
                        ))
                      ) : (
                        <p>No clients available</p>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Invoice Items</h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="itemwise-tax"
                      checked={isItemwiseTax}
                      onCheckedChange={(checked) => {
                        setIsItemwiseTax(checked)
                        setInvoiceData((prev) => ({ ...prev, isItemwiseTax: checked }))
                      }}
                    />
                    <Label htmlFor="itemwise-tax">Itemwise Tax</Label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearAllItems}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Clear All
                  </Button>
                </div>
                {!isItemwiseTax && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="totalTaxRate">Total Tax Rate (%)</Label>
                    <Input
                      
                      id="totalTaxRate"
                      type="number"
                      value={totalTaxRate}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value)
                        setTotalTaxRate(value)
                        setInvoiceData((prev) => ({ ...prev, totalTaxRate: value }))
                      }}
                      className="w-20"
                    />
                  </div>
                )}
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
                      <TableRow key={item._id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleEditInvoiceItem(
                                item._id,
                                'quantity',
                                e.target.value
                              )
                            }
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              handleEditInvoiceItem(
                                item._id,
                                'price',
                                e.target.value
                              )
                            }
                            className="w-24"
                          />
                        </TableCell>
                        {isItemwiseTax && (
                          <TableCell>
                            <Input
                              type="number"
                              value={item.tax || 0}
                              onChange={(e) =>
                                handleEditInvoiceItem(
                                  item._id,
                                  'tax',
                                  e.target.value
                                )
                              }
                              className="w-20"
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          ₹
                          {(
                            item.quantity *
                            item.price *
                            (1 +
                              (isItemwiseTax ? item.tax || 0 : totalTaxRate) /
                                100)
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveInvoiceItem(item._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="manual-entry"
                    checked={isManualEntry}
                    onCheckedChange={setIsManualEntry}
                  />
                  <Label htmlFor="manual-entry">Manual Entry</Label>
                </div>
                <div className="flex items-end gap-2">
                  <div className="grid grid-cols-5 gap-2 flex-grow">
                    {isManualEntry ? (
                      <Input
                        placeholder="Item name"
                        value={selectedItem?.name || ''}
                        onChange={(e) =>
                          setSelectedItem((prev) =>
                            prev ? { ...prev, name: e.target.value } : null
                          )
                        }
                      />
                    ) : (
                      <Select onValueChange={handleSelectItem}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an item" />
                        </SelectTrigger>
                        <SelectContent>
                          {items && items.length > 0 ? (
                            items.map((item) => (
                              <SelectItem key={item._id} value={item._id}>
                                {item.name}
                              </SelectItem>
                            ))
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
                      onChange={(e) =>
                        setItemQuantity(parseInt(e.target.value))
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={selectedItem?.price || ''}
                      onChange={(e) =>
                        setSelectedItem((prev) =>
                          prev
                            ? { ...prev, price: parseFloat(e.target.value) }
                            : null
                        )
                      }
                      readOnly={!isManualEntry}
                    />
                    {isItemwiseTax && (
                      <Input
                        type="number"
                        placeholder="Tax (%)"
                        value={selectedItem?.tax || 0}
                        onChange={(e) =>
                          setSelectedItem((prev) =>
                            prev
                              ? { ...prev, tax: parseFloat(e.target.value) }
                              : null
                          )
                        }
                        readOnly={!isManualEntry}
                      />
                    )}
                    <Button type="button" onClick={handleAddInvoiceItem}>
                      <Plus className="h-4 w-4 mr-2" /> Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Information</h3>
                <div className="space-y-2">
                  <Label>Payment Status</Label>
                  <RadioGroup
                    value={paymentStatus}
                    onValueChange={(value: 'paid' | 'due' | 'duedate') => {
                      setPaymentStatus(value)
                      setInvoiceData((prev) => ({ ...prev, paymentStatus: value }))
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paid" id="paid" />
                      <Label htmlFor="paid">Paid</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="due" id="due" />
                      <Label htmlFor="due">Due</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="duedate" id="duedate" />
                      <Label htmlFor="duedate">Due Date</Label>
                    </div>
                  </RadioGroup>
                </div>
                {paymentStatus === 'duedate' && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => {
                        setDueDate(e.target.value)
                        setInvoiceData((prev) => ({ ...prev, dueDate: e.target.value }))
                      }}
                    />
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Label htmlFor="billDate">Bill Generation Date</Label>
                  <Input
                    id="billDate"
                    type="date"
                    value={billDate}
                    onChange={(e) => {
                      setBillDate(e.target.value)
                      setInvoiceData((prev) => ({ ...prev, billDate: e.target.value }))
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">
                  Total: ₹{calculateTotal().toFixed(2)}
                </div>
                <Button type="button" variant="outline" onClick={handleClearForm}>
                  Clear
                </Button>
                <Button type="submit">Create Invoice</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default InvoiceGeneration;