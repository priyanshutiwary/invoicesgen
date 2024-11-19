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
import { BusinessDetails, Invoice, Client, InvoiceItem } from '@/backend/types/type'
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, FileTextIcon, UserIcon, CreditCardIcon, TruckIcon } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

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
  isViewInvoiceHistory: boolean;
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
  setCurrentInvoice,
  isViewInvoiceHistory
}: InvoicePreviewProps) {
  const { handleSaveInvoice } = useInvoiceHandler(setInvoiceHistory, setIsInvoicePreviewOpen, setCurrentInvoice)
  const businessId = businessDetails._id;
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy')
  }

  const calculateItemTotal = (item: InvoiceItem) => {
    const itemTotal = item.quantity * item.price
    const taxAmount = currentInvoice?.isItemwiseTax 
      ? (itemTotal * item.tax) / 100 
      : (itemTotal * (currentInvoice?.totalTaxRate || 0)) / 100
    return itemTotal + taxAmount
  }

  const calculateTotalTax = () => {
    if (!currentInvoice) return 0;
    if (currentInvoice.isItemwiseTax) {
      return currentInvoice.items.reduce((total, item) => {
        return total + (item.quantity * item.price * item.tax) / 100;
      }, 0);
    } else {
      return (currentInvoice.total * currentInvoice.totalTaxRate) / 100;
    }
  }

  if (!currentInvoice) {
    return null;
  }
  
  const handleSave = () => {
    if (currentInvoice) {
      const invoiceWithBusinessId = { ...currentInvoice, businessId }
      handleSaveInvoice(invoiceWithBusinessId)
    }
  }

  const client = clients.find(c => c._id === currentInvoice.clientId) || 
    (currentInvoice.clientId === 'new' 
      ? { name: 'New Client', contact: 'Contact info not available', gstNumber: 'GST info not available' } 
      : { name: 'Client Name', contact: 'Client Contact', gstNumber: 'Client GST Number' });

  const totalTax = calculateTotalTax();
  const cgst = totalTax / 2;
  const sgst = totalTax / 2;

  return (
    <Dialog open={isInvoicePreviewOpen} onOpenChange={setIsInvoicePreviewOpen}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-6 pb-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
          <DialogTitle className="text-2xl sm:text-3xl font-bold dark:text-gray-100">
            Invoice Preview
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <Card ref={targetRef} className="border-0 shadow-none dark:bg-gray-900">
            <CardHeader className="bg-primary/5 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">{businessDetails.name}</CardTitle>
                  <CardDescription className="mt-2 text-sm">
                    <p>{businessDetails.address}</p>
                    <p>Contact: {businessDetails.contact}</p>
                    <p>GST: {businessDetails.gstNumber}</p>
                  </CardDescription>
                </div>
                <div className="w-full sm:w-auto sm:text-right">
                  <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">Invoice Details</h3>
                  <p className="flex items-center sm:justify-end gap-2 text-sm">
                    <FileTextIcon className="w-4 h-4" />
                    Invoice ID: {currentInvoice.invoice_id}
                  </p>
                  <p className="flex items-center sm:justify-end gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4" />
                    Bill Date: {formatDate(currentInvoice.billDate)}
                  </p>
                  {currentInvoice.paymentStatus === 'duedate' && currentInvoice.dueDate && (
                    <p className="flex items-center sm:justify-end gap-2 text-sm">
                      <CalendarIcon className="w-4 h-4" />
                      Due Date: {formatDate(currentInvoice.dueDate)}
                    </p>
                  )}
                  <Badge variant={currentInvoice.paymentStatus === 'paid' ? 'success' : 'destructive'} className="mt-2">
                    {currentInvoice.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-4 sm:p-6">
              <div className="bg-secondary/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Client Information
                </h3>
                <p className="text-sm"><strong>Name:</strong> {currentInvoice.client.name}</p>
                <p className="text-sm"><strong>Contact:</strong> {currentInvoice.client.contact}</p>
                <p className="text-sm"><strong>GST:</strong> {currentInvoice.client.gst_number}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <TruckIcon className="w-5 h-5" />
                    Shipping Details
                  </h3>
                  <p className="text-sm"><strong>Address:</strong> {currentInvoice.client.address || 'N/A'}</p>
                  <p className="text-sm"><strong>City:</strong> {currentInvoice.client.city || 'N/A'}</p>
                  <p className="text-sm"><strong>State:</strong> {currentInvoice.client.state || 'N/A'}</p>
                  <p className="text-sm"><strong>Postal Code:</strong> {currentInvoice.client.postalCode || 'N/A'}</p>
                </div>
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <CreditCardIcon className="w-5 h-5" />
                    Payment Details
                  </h3>
                  <p className="text-sm"><strong>Method:</strong> {currentInvoice.paymentMethod || 'N/A'}</p>
                  <p className="text-sm"><strong>Terms:</strong> {currentInvoice.paymentTerms || 'N/A'}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <h3 className="text-xl font-semibold mb-4">Invoice Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead className="font-bold">Item</TableHead>
                      <TableHead className="font-bold text-right">Quantity</TableHead>
                      <TableHead className="font-bold text-right">Price</TableHead>
                      {currentInvoice.isItemwiseTax && <TableHead className="font-bold text-right">Tax (%)</TableHead>}
                      <TableHead className="font-bold text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentInvoice.items.map((item, index) => (
                      <TableRow key={item._id} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                        {currentInvoice.isItemwiseTax && <TableCell className="text-right">{item.tax}%</TableCell>}
                        <TableCell className="text-right font-medium">₹{calculateItemTotal(item).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pt-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Subtotal: ₹{(currentInvoice.total - totalTax).toFixed(2)}</p>
                  <p className="text-sm font-medium">CGST (50%): ₹{cgst.toFixed(2)}</p>
                  <p className="text-sm font-medium">SGST (50%): ₹{sgst.toFixed(2)}</p>
                  {!currentInvoice.isItemwiseTax && (
                    <p className="text-sm font-medium">Total Tax Rate: {currentInvoice.totalTaxRate}%</p>
                  )}
                </div>
                <div className="text-2xl font-bold text-primary mt-4 sm:mt-0">
                  Total: ₹{currentInvoice.total.toFixed(2)}
                </div>
              </div>

              <div className="mt-6 text-sm">
                <h4 className="font-semibold mb-2">Terms and Conditions:</h4>
                <p>{currentInvoice.termsAndConditions || 'Standard terms and conditions apply.'}</p>
              </div>

              <div className="mt-4 text-sm">
                <h4 className="font-semibold mb-2">Notes:</h4>
                <p>{currentInvoice.notes || 'Thank you for your business!'}</p>
              </div>
            </CardContent>
          </Card>
        </ScrollArea>

        <CardFooter className="flex flex-wrap justify-end gap-2 p-4 sm:p-6 bg-background dark:bg-gray-900 border-t dark:border-gray-800 sticky bottom-0">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
          >
            Close
          </Button>
          {!isViewInvoiceHistory && (
            <>
              <Button 
                variant="secondary" 
                onClick={onEdit}
                className="dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
              >
                Edit
              </Button>
              <Button 
                variant="default" 
                onClick={() => handleSave()}
                className="dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Save
              </Button>
            </>
          )}
          <Button 
            variant="primary" 
            onClick={toPDF}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Print Invoice
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InvoicePreview