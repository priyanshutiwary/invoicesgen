import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Phone, MessageCircle, ChevronRight } from 'lucide-react'
import { Invoice, BusinessDetails } from '@/backend/types/type'
import { toast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type PaymentType = 'incoming' | 'outgoing'

interface PaymentTableProps {
  payments: Invoice[]
  type: PaymentType
  businessDetails: BusinessDetails
  onSort: (field: keyof Invoice) => void
  sortField?: keyof Invoice  
  sortDirection?: 'asc' | 'desc' 
  onRowClick?: (invoice: Invoice) => void
}

export function PaymentTable({
  payments,
  type,
  businessDetails,
  onSort,
  sortField = 'invoice_number',
  sortDirection = 'desc',
  onRowClick,
}: PaymentTableProps) {
  const shareOnWhatsApp = (e: React.MouseEvent, invoice: Invoice) => {
    e.stopPropagation()
    const message = `From: ${businessDetails.name}
    ${type === 'incoming' ? 'Invoice' : 'Bill'} details:
    ${type === 'incoming' ? 'Invoice' : 'Bill'} Number: ${invoice.invoice_number}
    ${type === 'incoming' ? 'Client' : 'Vendor'}: ${invoice.client.name || 'N/A'}
    Amount: ₹${invoice.total_amount.toFixed(2)}
    Due Date: ${new Date(invoice.billDate).toLocaleDateString()}
    Status: ${invoice.paymentStatus}`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const initiatePhoneCall = (e: React.MouseEvent, invoice: Invoice) => {
    e.stopPropagation()
    const phoneNumber = invoice.client.phone || invoice.client.contact
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`
    } else {
      toast({
        title: 'No Phone Number',
        description: 'No contact number available for this client',
        variant: 'destructive',
      })
    }
  }

  const sortOptions = [
    { value: 'invoice_number', label: type === 'incoming' ? 'Invoice Number' : 'Bill Number' },
    { value: 'billDate', label: 'Due Date' },
    { value: 'total_amount', label: 'Amount' },
    { value: 'paymentStatus', label: 'Status' }
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={sortField}
          onValueChange={(value) => onSort(value as keyof Invoice)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortDirection}
          onValueChange={(value) => onSort(sortField)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort direction" />
          </SelectTrigger>
          <SelectContent>
           <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                {type === 'incoming' ? 'Invoice' : 'Bill'}
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                {type === 'incoming' ? 'Client' : 'Vendor'}
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Due Date
              </TableHead>
              <TableHead>
                Amount
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                Status
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((invoice) => (
              <TableRow 
                key={invoice._id}
                onClick={() => onRowClick?.(invoice)}
                className="cursor-pointer transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              >
                <TableCell className="font-medium">
                  {invoice.invoice_number}
                </TableCell>
                <TableCell className="hidden sm:table-cell">{invoice.client.name || 'N/A'}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(invoice.billDate).toLocaleDateString()}
                </TableCell>
                <TableCell>₹{invoice.total_amount.toFixed(2)}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                    {invoice.paymentStatus}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 sm:h-8 sm:w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={(e) => initiatePhoneCall(e, invoice)}>
                      <Phone className="h-5 w-5 sm:h-4 sm:w-4" />
                      <span className="sr-only">Call Client</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 sm:h-8 sm:w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={(e) => shareOnWhatsApp(e, invoice)}>
                      <MessageCircle className="h-5 w-5 sm:h-4 sm:w-4" />
                      <span className="sr-only">Share on WhatsApp</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 sm:h-8 sm:w-8"
                      onClick={(e) => { e.stopPropagation(); onRowClick?.(invoice); }}>
                      <ChevronRight className="h-5 w-5 sm:h-4 sm:w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default PaymentTable;

