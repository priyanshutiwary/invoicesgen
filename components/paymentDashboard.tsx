'use client'

import { useState } from 'react'
import { Calendar, DollarSign, ChevronRight, MessageCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Sample data
const incomingPayments = [
  {
    id: '1',
    client: 'Acme Corp',
    amount: 1499.99,
    dueDate: '2024-12-20',
    status: 'Pending',
    invoiceNumber: 'INV-001',
  },
  {
    id: '2',
    client: 'TechStart Inc',
    amount: 2750.00,
    dueDate: '2024-12-25',
    status: 'Pending',
    invoiceNumber: 'INV-002',
  },
  {
    id: '3',
    client: 'Global Services',
    amount: 899.50,
    dueDate: '2024-12-28',
    status: 'Pending',
    invoiceNumber: 'INV-003',
  },
]

const outgoingPayments = [
  {
    id: '1',
    vendor: 'Office Supplies Co',
    amount: 250.00,
    dueDate: '2024-12-22',
    status: 'Pending',
    billNumber: 'BILL-001',
  },
  {
    id: '2',
    vendor: 'Web Hosting Services',
    amount: 99.99,
    dueDate: '2024-12-30',
    status: 'Pending',
    billNumber: 'BILL-002',
  },
]

type PaymentType = 'incoming' | 'outgoing'

export default function PendingPayments() {
  const [activeType, setActiveType] = useState<PaymentType>('incoming')
  
  const payments = activeType === 'incoming' ? incomingPayments : outgoingPayments
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pending Amount
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Due Dates
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">
              Payments due this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
          <CardDescription>
            A list of all pending payments and their status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="incoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="incoming" onClick={() => setActiveType('incoming')}>Incoming</TabsTrigger>
              <TabsTrigger value="outgoing" onClick={() => setActiveType('outgoing')}>Outgoing</TabsTrigger>
            </TabsList>
            <TabsContent value="incoming">
              <PaymentTable payments={incomingPayments} type="incoming" />
            </TabsContent>
            <TabsContent value="outgoing">
              <PaymentTable payments={outgoingPayments} type="outgoing" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface Payment {
  id: string
  amount: number
  dueDate: string
  status: string
  invoiceNumber?: string
  billNumber?: string
  client?: string
  vendor?: string
}

function PaymentTable({ payments, type }: { payments: Payment[], type: PaymentType }) {
  const shareOnWhatsApp = (payment: Payment) => {
    const message = `${type === 'incoming' ? 'Invoice' : 'Bill'} details:
${type === 'incoming' ? 'Invoice' : 'Bill'} Number: ${type === 'incoming' ? payment.invoiceNumber : payment.billNumber}
${type === 'incoming' ? 'Client' : 'Vendor'}: ${type === 'incoming' ? payment.client : payment.vendor}
Amount: ₹${payment.amount.toFixed(2)}
Due Date: ${new Date(payment.dueDate).toLocaleDateString()}
Status: ${payment.status}`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{type === 'incoming' ? 'Invoice' : 'Bill'}</TableHead>
          <TableHead>{type === 'incoming' ? 'Client' : 'Vendor'}</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">
              {type === 'incoming' ? payment.invoiceNumber : payment.billNumber}
            </TableCell>
            <TableCell>
              {type === 'incoming' ? payment.client : payment.vendor}
            </TableCell>
            <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
            <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                {payment.status}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => shareOnWhatsApp(payment)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="sr-only">Share on WhatsApp</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

