import React from 'react'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Client {
  _id: string
  name: string
  contact: string
  gstNumber: string
}

interface InvoiceItem {
  _id: string
  name: string
  quantity: number
  price: number
  tax: number
}

interface Invoice {
  _id: string
  clientId: string
  items: InvoiceItem[]
  total: number
  paymentStatus: 'paid' | 'due' | 'duedate'
  dueDate?: string
  billDate: string
  isItemwiseTax: boolean
  totalTaxRate: number
}

interface InvoiceViewerProps {
  invoice: Invoice | null
  client: Client | null
  isOpen: boolean
  onClose: () => void
}

export default function InvoiceViewer({ invoice, client, isOpen, onClose }: InvoiceViewerProps) {
  if (!invoice || !client) return null

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  const calculateItemTotal = (item: InvoiceItem) => {
    const itemTotal = item.quantity * item.price
    const taxAmount = invoice.isItemwiseTax
      ? (itemTotal * item.tax) / 100
      : (itemTotal * invoice.totalTaxRate) / 100
    return itemTotal + taxAmount
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Invoice Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Client Information</h3>
              <p>Name: {client.name}</p>
              <p>Contact: {client.contact}</p>
              <p>GST Number: {client.gstNumber}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Invoice Information</h3>
              <p>Invoice ID: {invoice._id}</p>
              <p>Bill Date: {formatDate(invoice.billDate)}</p>
              <p>Payment Status: {invoice.paymentStatus}</p>
              {invoice.paymentStatus === 'duedate' && invoice.dueDate && (
                <p>Due Date: {formatDate(invoice.dueDate)}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Invoice Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  {invoice.isItemwiseTax && <TableHead>Tax (%)</TableHead>}
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₹{item.price.toFixed(2)}</TableCell>
                    {invoice.isItemwiseTax && <TableCell>{item.tax}%</TableCell>}
                    <TableCell>₹{calculateItemTotal(item).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center">
            <div>
              {!invoice.isItemwiseTax && (
                <p>Total Tax Rate: {invoice.totalTaxRate}%</p>
              )}
            </div>
            <div className="text-xl font-semibold">
              Total: ₹{invoice.total.toFixed(2)}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
          <Button variant="outline">Print Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}