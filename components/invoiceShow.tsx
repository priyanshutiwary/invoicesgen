import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface InvoiceItem {
  item: string;
  quantity: number;
  price: number;
  tax: number;
}

interface Invoice {
  _id: string;
  invoice_number: string;
  billDate: string;
  dueDate?: string;
  total_amount: number;
  paymentStatus: string;
  customerName: string;
  items: InvoiceItem[];
}

interface BusinessDetails {
  name: string;
  address: string;
  contact: string;
  email: string;
  website: string;
  gstNumber: string;
}

interface InvoicePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  businessDetails: BusinessDetails;
}

export function InvoicePreview({ isOpen, onClose, invoice, businessDetails }: InvoicePreviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Invoice {invoice.invoice_number}</CardTitle>
            <CardDescription>Invoice details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-semibold">{businessDetails.name}</h3>
                <p>{businessDetails.address}</p>
                <p>Contact: {businessDetails.contact}</p>
                <p>Email: {businessDetails.email}</p>
                <p>Website: {businessDetails.website}</p>
                <p>GST: {businessDetails.gstNumber}</p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold">Invoice Details</h3>
                <p>Invoice Number: {invoice.invoice_number}</p>
                <p>Bill Date: {formatDate(invoice.billDate)}</p>
                {invoice.dueDate && <p>Due Date: {formatDate(invoice.dueDate)}</p>}
                <p>Payment Status: {invoice.paymentStatus}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
              <p>Name: {invoice.customerName}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Invoice Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Tax (%)</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.tax}%</TableCell>
                      <TableCell>₹{(item.quantity * item.price * (1 + item.tax / 100)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end items-center border-t pt-4">
              <div className="text-xl font-semibold">
                Total: ₹{invoice.total_amount.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
        <CardFooter className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => window.print()}>Print Invoice</Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InvoicePreview