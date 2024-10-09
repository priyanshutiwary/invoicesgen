import React from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function InvoicePreview({ isInvoicePreviewOpen, setIsInvoicePreviewOpen, currentInvoice, businessDetails, targetRef, toPDF }) {
  return (
    <Dialog open={isInvoicePreviewOpen} onOpenChange={setIsInvoicePreviewOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
          <DialogDescription>
            Review your invoice before finalizing
          </DialogDescription>
        </DialogHeader>
        {currentInvoice && (
          <div ref={targetRef} className="p-4 md:p-6 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl md:text-2xl font-bold mb-2">{businessDetails.name}</h2>
                <p className="text-sm md:text-base">{businessDetails.address}</p>
                <p className="text-sm md:text-base">GST: {businessDetails.gstNumber}</p>
              </div>
              <div className="text-left md:text-right">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Invoice</h3>
                <p className="text-sm md:text-base">Invoice #: {currentInvoice.number}</p>
                <p className="text-sm md:text-base">Date: {currentInvoice.date}</p>
                <p className="text-sm md:text-base">Due Date: {currentInvoice.dueDate}</p>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
              <p className="text-sm md:text-base">{currentInvoice.client.name}</p>
              <p className="text-sm md:text-base">{currentInvoice.client.email}</p>
              <p className="text-sm md:text-base">GST: {currentInvoice.client.gstNumber}</p>
            </div>
            <div className="overflow-x-auto">
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
                      <TableCell className="text-sm md:text-base">{item.name}</TableCell>
                      <TableCell className="text-right text-sm md:text-base">{item.quantity}</TableCell>
                      <TableCell className="text-right text-sm md:text-base">₹{item.price.toFixed(2)}</TableCell>
                      {currentInvoice.isItemwiseTax && <TableCell className="text-right text-sm md:text-base">{item.tax}%</TableCell>}
                      <TableCell className="text-right text-sm md:text-base">
                        ₹{((item.quantity * item.price) * (1 + (currentInvoice.isItemwiseTax ? item.tax : currentInvoice.totalTaxRate) / 100)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-8 text-right">
              <p className="text-lg md:text-xl font-semibold">Total: ₹{currentInvoice.amount.toFixed(2)}</p>
            </div>
          </div>
        )}
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={() => toPDF()}>Download PDF</Button>
          <Button onClick={() => setIsInvoicePreviewOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}