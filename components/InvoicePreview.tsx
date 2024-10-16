import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useInvoiceHandler } from '@/handler/invoiceHandler'

interface BusinessDetails {
  name: string;
  address: string;
  contact: string;
  email: string;
  website: string;
  gstNumber: string;
}

interface Client {
  _id: string;
  name: string;
  contact: string;
  gstNumber: string;
}

interface InvoiceItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  tax: number;
}

interface Invoice {
  _id: string;
  clientId: string;
  items: InvoiceItem[];
  total: number;
  paymentStatus: 'paid' | 'due' | 'duedate';
  dueDate?: string;
  billDate: string;
  isItemwiseTax: boolean;
  totalTaxRate: number;
}

interface InvoicePreviewProps {
  isInvoicePreviewOpen: boolean;
  setIsInvoicePreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentInvoice: Invoice | null;
  businessDetails: BusinessDetails;
  targetRef: React.RefObject<HTMLDivElement>;
  toPDF: () => void;
  onEdit: () => void;
  onClose: () => void;
  clients: Client[];
  setInvoiceHistory: React.Dispatch<React.SetStateAction<Invoice[]>>;
  setCurrentInvoice: React.Dispatch<React.SetStateAction<Invoice | null>>;
}

export function InvoicePreview({ 
  isInvoicePreviewOpen, 
  setIsInvoicePreviewOpen, 
  currentInvoice, 
  businessDetails, 
  targetRef, 
  toPDF,
  onEdit,
  onClose,
  clients,
  setInvoiceHistory,
  setCurrentInvoice
}: InvoicePreviewProps) {
  const { handleSaveInvoice } = useInvoiceHandler(setInvoiceHistory, setIsInvoicePreviewOpen, setCurrentInvoice)
  const businessId = businessDetails._id;
  
  
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  const calculateItemTotal = (item: InvoiceItem) => {
    const itemTotal = item.quantity * item.price
    const taxAmount = currentInvoice?.isItemwiseTax 
      ? (itemTotal * item.tax) / 100 
      : (itemTotal * (currentInvoice?.totalTaxRate || 0)) / 100
    return itemTotal + taxAmount
  }

  if (!currentInvoice) {
    return null;
  }
  
  const handleSave = () => {
    if (currentInvoice) {
      const invoiceWithBusinessId = { ...currentInvoice, businessId }
      console.log("Invoice data being sent:", invoiceWithBusinessId)
      handleSaveInvoice(invoiceWithBusinessId)
    }
  }

  const client = clients.find(c => c._id === currentInvoice.clientId) || 
    (currentInvoice.clientId === 'new' 
      ? { name: 'New Client', contact: 'Contact info not available', gstNumber: 'GST info not available' } 
      : { name: 'Client Name', contact: 'Client Contact', gstNumber: 'Client GST Number' });

  return (
    <Dialog open={isInvoicePreviewOpen} onOpenChange={setIsInvoicePreviewOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>
        <Card ref={targetRef}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Invoice Preview</CardTitle>
            <CardDescription>Review your invoice before finalizing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-semibold">{businessDetails.name}</h3>
                <p>{businessDetails.address}</p>
                <p>Contact: {businessDetails.contact}</p>
                <p>Email: {businessDetails.email || 'N/A'}</p>
                <p>Website: {businessDetails.website || 'N/A'}</p>
                <p>GST: {businessDetails.gstNumber}</p>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold">Invoice Details</h3>
                <p>Invoice ID: {currentInvoice._id}</p>
                <p>Bill Date: {formatDate(currentInvoice.billDate)}</p>
                {currentInvoice.paymentStatus === 'duedate' && currentInvoice.dueDate && (
                  <p>Due Date: {formatDate(currentInvoice.dueDate)}</p>
                )}
                <p>Payment Status: {currentInvoice.paymentStatus}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Client Information</h3>
              <p>Name: {client.name}</p>
              <p>Contact: {client.contact}</p>
              <p>GST: {client.gstNumber}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Invoice Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    {currentInvoice.isItemwiseTax && <TableHead>Tax (%)</TableHead>}
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentInvoice.items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.price.toFixed(2)}</TableCell>
                      {currentInvoice.isItemwiseTax && <TableCell>{item.tax}%</TableCell>}
                      <TableCell>₹{calculateItemTotal(item).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <div>
                {!currentInvoice.isItemwiseTax && (
                  <p>Total Tax Rate: {currentInvoice.totalTaxRate}%</p>
                )}
              </div>
              <div className="text-xl font-semibold">
                Total: ₹{currentInvoice.total.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
        <CardFooter className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={onEdit}>Edit</Button>
          <Button onClick={() => handleSave()}>Save</Button>
          <Button onClick={toPDF}>Print Invoice</Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InvoicePreview