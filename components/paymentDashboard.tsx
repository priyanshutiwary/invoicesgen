// /** @format */

// 'use client'

// import { useState, useEffect } from 'react'
// import {
// 	Calendar,
// 	DollarSign,
// 	ChevronRight,
// 	MessageCircle,
// 	Phone,
// } from 'lucide-react'
// import { ApiResponse } from '@/backend/types/ApiResponse'
// import axios from 'axios'
// import { Button } from '@/components/ui/button'
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardHeader,
// 	CardTitle,
// } from '@/components/ui/card'
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from '@/components/ui/table'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Header } from './Header'
// import { toast } from '@/components/ui/use-toast'
// import { signOut, useSession } from 'next-auth/react'
// import BusinessSelector from './businessSelector'
// import {
// 	BusinessDetails,
// 	Client,
// 	Item,
// 	Invoice,
// 	Business,
// 	InvoiceItem,
// 	UserProfile,
// } from '@/backend/types/type'
// import { useBusinessHandlers } from '@/handler/businessHandler'
// import { useInvoiceHandler } from '@/handler/invoiceHandler'

// // Sample data
// const incomingPayments = [
// 	{
// 		id: '1',
// 		client: 'Acme Corp',
// 		amount: 1499.99,
// 		dueDate: '2024-12-20',
// 		status: 'Pending',
// 		invoiceNumber: 'INV-001',
// 	},
// 	{
// 		id: '2',
// 		client: 'TechStart Inc',
// 		amount: 2750.0,
// 		dueDate: '2024-12-25',
// 		status: 'Pending',
// 		invoiceNumber: 'INV-002',
// 	},
// 	{
// 		id: '3',
// 		client: 'Global Services',
// 		amount: 899.5,
// 		dueDate: '2024-12-28',
// 		status: 'Pending',
// 		invoiceNumber: 'INV-003',
// 	},
// ]

// const outgoingPayments = [
// 	{
// 		id: '1',
// 		vendor: 'Office Supplies Co',
// 		amount: 250.0,
// 		dueDate: '2024-12-22',
// 		status: 'Pending',
// 		billNumber: 'BILL-001',
// 	},
// 	{
// 		id: '2',
// 		vendor: 'Web Hosting Services',
// 		amount: 99.99,
// 		dueDate: '2024-12-30',
// 		status: 'Pending',
// 		billNumber: 'BILL-002',
// 	},
// ]

// type PaymentType = 'incoming' | 'outgoing'

// export default function PendingPayments() {
// 	const [activeType, setActiveType] = useState<PaymentType>('incoming')
// 	const { data: session } = useSession()
// 	const [userName, setUserName] = useState<string | undefined>(undefined)
// 	const [user_id, setUser_id] = useState<string | undefined>(undefined)
// 	const [userDetail, setUserDetail] = useState<UserProfile[]>([])
// 	const [businesses, setBusinesses] = useState<Business[]>([])
// 	const [selectedBusinessId, setSelectedBusinessId] = useState<string>('')
// 	const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
// 		_id: '',
// 		userId: '',
// 		name: '',
// 		contact: '',
// 		address: '',
// 		description: '',
// 		gstNumber: '',
// 	})
// 	const [clients, setClients] = useState<Client[]>([])
// 	const [items, setItems] = useState<Item[]>([])
// 	const [invoiceHistory, setInvoiceHistory] = useState<Invoice[]>([])
// 	const [incomingDuePayment, setIncomingDuePayment] = useState<Invoice[]>([])
// 	const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
// 	const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false)
// 	const payments =
// 		activeType === 'incoming' ? incomingPayments : outgoingPayments
// 	const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
// 	//   const urlParams = new URLSearchParams(window.location.search);
// 	//   setUser_id(urlParams.get('user_id'))
// 	//   setSelectedBusinessId(urlParams.get('selectedBusinessId'))
// 	//   console.log("userId",selectedBusinessId);

// 	const {
// 		handleSaveInvoice,
// 		handleViewInvoiceHistory,
// 		handleExtendDate,
// 		handleMarkPayment,
// 		handleDeleteInvoice,
// 	} = useInvoiceHandler(
// 		setInvoiceHistory,
// 		setIncomingDuePayment,
// 		setIsInvoicePreviewOpen,
// 		setCurrentInvoice
// 	)

// 	const {
// 		handleBusinessDetailsChange,
// 		handleSaveBusinessDetails,
// 		handleBusinessChange,
// 		handleDeleteBusiness,
// 	} = useBusinessHandlers(
// 		setBusinessDetails,
// 		setSelectedBusinessId,
// 		setClients,
// 		setItems,
// 		setInvoiceHistory,
// 		businessDetails,
// 		user_id,
// 		handleViewInvoiceHistory
// 	)

// 	useEffect(() => {
// 		const fetchUserId = async () => {
// 			await setUserName(session?.user?.username)
// 			await setUser_id(session?.user?._id)
// 		}
// 		fetchUserId()
// 	}, [session])

// 	useEffect(() => {
// 		if (!user_id) return
// 		const fetchUserDetails = async () => {
// 			try {
// 				const response = await axios.get<ApiResponse>(
// 					`/api/getUserDetails?user_id=${user_id}`
// 				)
// 				setUserDetail(response.data.userDetail)
// 			} catch (error) {
// 				console.error('Error fetching userDetails', error)
// 				toast({
// 					title: 'Error',
// 					description: 'Failed to fetch Details',
// 					variant: 'destructive',
// 				})
// 			}
// 		}
// 		const fetchBusinesses = async () => {
// 			try {
// 				const response = await axios.get<ApiResponse>(
// 					`/api/getUserBusinesses?user_id=${user_id}`
// 				)
// 				console.log(response)

// 				setBusinesses(response.data.businesses)

// 				if (response.data.businesses.length > 0 && !selectedBusinessId) {
// 					const firstBusinessId = response.data.businesses[0]._id

// 					setSelectedBusinessId(firstBusinessId)

// 					setBusinessDetails({
// 						...businessDetails,
// 						_id: response.data.businesses[0]._id,
// 						name: response.data.businesses[0].name,
// 						contact: response.data.businesses[0].contact,
// 						address: response.data.businesses[0].address,
// 						description: response.data.businesses[0].description,
// 						gstNumber: response.data.businesses[0].gst_number,
// 					})

// 					setClients(response.data.businesses[0].clients)
// 					setItems(response.data.businesses[0].items)
// 				}
// 			} catch (error) {
// 				console.error('Error fetching businesses', error)
// 				toast({
// 					title: 'Error',
// 					description: 'Failed to fetch businesses',
// 					variant: 'destructive',
// 				})
// 			}
// 		}

// 		if (session) {
// 			fetchBusinesses()
// 			fetchUserDetails()
// 		}
// 		if (fetchBusinesses && fetchUserDetails) {
// 			handleViewInvoiceHistory(selectedBusinessId)
// 		}
// 	}, [session, user_id, selectedBusinessId])

// 	return (
// 		<div className="space-y-6">
// 			<Header />
// 			<BusinessSelector
// 				businesses={businesses}
// 				selectedBusinessId={selectedBusinessId}
// 				onBusinessChange={handleBusinessChange}
// 			/>
// 			<div className="grid gap-6 md:grid-cols-2">
// 				<Card>
// 					<CardHeader className="flex flex-row items-center justify-between pb-2">
// 						<CardTitle className="text-sm font-medium">
// 							Total Pending Amount
// 						</CardTitle>
// 						<DollarSign className="h-4 w-4 text-muted-foreground" />
// 					</CardHeader>
// 					<CardContent>
// 						<div className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</div>
// 						<p className="text-xs text-muted-foreground">
// 							+20.1% from last month
// 						</p>
// 					</CardContent>
// 				</Card>
// 				<Card>
// 					<CardHeader className="flex flex-row items-center justify-between pb-2">
// 						<CardTitle className="text-sm font-medium">
// 							Upcoming Due Dates
// 						</CardTitle>
// 						<Calendar className="h-4 w-4 text-muted-foreground" />
// 					</CardHeader>
// 					<CardContent>
// 						<div className="text-2xl font-bold">{payments.length}</div>
// 						<p className="text-xs text-muted-foreground">
// 							Payments due this month
// 						</p>
// 					</CardContent>
// 				</Card>
// 			</div>

// 			<Card>
// 				<CardHeader>
// 					<CardTitle>Pending Payments</CardTitle>
// 					<CardDescription>
// 						A list of all pending payments and their status.
// 					</CardDescription>
// 				</CardHeader>
// 				<CardContent>
// 					<Tabs defaultValue="incoming" className="w-full">
// 						<TabsList className="grid w-full grid-cols-2">
// 							<TabsTrigger
// 								value="incoming"
// 								onClick={() => setActiveType('incoming')}>
// 								Incoming
// 							</TabsTrigger>
// 							<TabsTrigger
// 								value="outgoing"
// 								onClick={() => setActiveType('outgoing')}>
// 								Outgoing
// 							</TabsTrigger>
// 						</TabsList>
// 						<TabsContent value="incoming">
// 							<PaymentTable
// 								payments={invoiceHistory}
// 								type="incoming"
// 								businessDetails={businessDetails}
// 							/>
// 						</TabsContent>
// 						<TabsContent value="outgoing">
// 							<PaymentTable
// 								payments={outgoingPayments}
// 								type="outgoing"
// 								businessDetails={businessDetails}
// 							/>
// 						</TabsContent>
// 					</Tabs>
// 				</CardContent>
// 			</Card>
// 		</div>
// 	)
// }

// export interface Invoice {
// 	_id: string | number
// 	businessId: string | number
// 	invoice_number: string
// 	clientId: string | number
// 	paymentStatus: string
// 	billDate: string
// 	dueDate: string
// 	total_amount: number
// 	items: Item[]
// 	isItemwiseTax: boolean
// 	totalTaxRate: number
// 	total: number
// 	client: Client[]
// 	invoice_id: string | number
// }

// type Payment = Invoice[]

// function PaymentTable({
// 	payments,
// 	type,
// 	businessDetails,
// }: {
// 	payments: Invoice[]
// 	type: PaymentType
// }) {
// 	const shareOnWhatsApp = (invoice: Invoice) => {
// 		const message = `From: ${businessDetails.name}
//     //  ${type === 'incoming' ? 'Invoice' : 'Bill'} details:
//      ${type === 'incoming' ? 'Invoice' : 'Bill'} Number: ${invoice.invoice_number}
//      ${type === 'incoming' ? 'Client' : 'Vendor'}: ${invoice.client.name || 'N/A'}
//      Amount: ₹${invoice.total_amount.toFixed(2)}
//      Due Date: ${new Date(invoice.billDate).toLocaleDateString()}
//      Status: ${invoice.paymentStatus}`

// 		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
// 		window.open(whatsappUrl, '_blank')
// 	}

// 	const initiatePhoneCall = (invoice: Invoice) => {
// 		const phoneNumber = invoice.client.phone || invoice.client.contact
// 		if (phoneNumber) {
// 			window.location.href = `tel:${phoneNumber}`
// 		} else {
// 			toast({
// 				title: 'No Phone Number',
// 				description: 'No contact number available for this client',
// 				variant: 'destructive',
// 			})
// 		}
// 	}

// 	return (
// 		<Table>
// 			<TableHeader>
// 				<TableRow>
// 					<TableHead>{type === 'incoming' ? 'Invoice' : 'Bill'}</TableHead>
// 					<TableHead>{type === 'incoming' ? 'Client' : 'Vendor'}</TableHead>
// 					<TableHead>Due Date</TableHead>
// 					<TableHead>Amount</TableHead>
// 					<TableHead>Status</TableHead>
// 					<TableHead className="text-right">Actions</TableHead>
// 				</TableRow>
// 			</TableHeader>
// 			<TableBody>
// 				{payments.map((invoice) => (
// 					<TableRow key={invoice._id}>
// 						<TableCell className="font-medium">
// 							{invoice.invoice_number}
// 						</TableCell>
// 						<TableCell>{invoice.client.name || 'N/A'}</TableCell>
// 						<TableCell>
// 							{new Date(invoice.billDate).toLocaleDateString()}
// 						</TableCell>
// 						<TableCell>₹{invoice.total_amount}</TableCell>
// 						<TableCell>
// 							<span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
// 								{invoice.paymentStatus}
// 							</span>
// 						</TableCell>
// 						<TableCell className="text-right">
// 							<div className="flex justify-end space-x-2">
// 								<Button
// 									variant="ghost"
// 									size="icon"
// 									className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
// 									onClick={() => initiatePhoneCall(invoice)}>
// 									<Phone className="h-4 w-4" />
// 									<span className="sr-only">Call Client</span>
// 								</Button>
// 								<Button
// 									variant="ghost"
// 									size="icon"
// 									className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
// 									onClick={() => shareOnWhatsApp(invoice)}>
// 									<MessageCircle className="h-4 w-4" />
// 									<span className="sr-only">Share on WhatsApp</span>
// 								</Button>
// 								<Button variant="ghost" size="icon" className="h-8 w-8">
// 									<ChevronRight className="h-4 w-4" />
// 									<span className="sr-only">View details</span>
// 								</Button>
// 							</div>
// 						</TableCell>
// 					</TableRow>
// 				))}
// 			</TableBody>
// 		</Table>
// 	)
// }

'use client'

import { useState, useEffect, useMemo } from 'react'
import { Calendar, DollarSign, ChevronRight, MessageCircle, Phone, ArrowUpDown, XCircle } from 'lucide-react'
import { ApiResponse } from '@/backend/types/ApiResponse'
import axios from 'axios'
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
import { Header } from './Header'
import { toast } from '@/components/ui/use-toast'
import { signOut, useSession } from 'next-auth/react'
import BusinessSelector from './businessSelector'
import {
  BusinessDetails,
  Client,
  Item,
  Invoice,
  Business,
  InvoiceItem,
  UserProfile,
} from '@/backend/types/type'
import { useBusinessHandlers } from '@/handler/businessHandler'
import { useInvoiceHandler } from '@/handler/invoiceHandler'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRangePicker } from '@/components/filters/date-picker'

type PaymentType = 'incoming' | 'outgoing'

export default function PendingPayments() {
  const [activeType, setActiveType] = useState<PaymentType>('incoming')
  const { data: session } = useSession()
  const [userName, setUserName] = useState<string | undefined>(undefined)
  const [user_id, setUser_id] = useState<string | undefined>(undefined)
  const [userDetail, setUserDetail] = useState<UserProfile[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('')
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    _id: '',
    userId: '',
    name: '',
    contact: '',
    address: '',
    description: '',
    gstNumber: '',
  })
  const [clients, setClients] = useState<Client[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [invoiceHistory, setInvoiceHistory] = useState<Invoice[]>([])
  const [incomingDuePayment, setIncomingDuePayment] = useState<Invoice[]>([])
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Invoice>('billDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedClient, setSelectedClient] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('unpaid')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })

  const {
    handleSaveInvoice,
    handleViewInvoiceHistory,
    handleExtendDate,
    handleMarkPayment,
    handleDeleteInvoice,
  } = useInvoiceHandler(
    setInvoiceHistory,
    setIncomingDuePayment,
    setIsInvoicePreviewOpen,
    setCurrentInvoice
  )

  const {
    handleBusinessDetailsChange,
    handleSaveBusinessDetails,
    handleBusinessChange,
    handleDeleteBusiness,
  } = useBusinessHandlers(
    setBusinessDetails,
    setSelectedBusinessId,
    setClients,
    setItems,
    setInvoiceHistory,
    businessDetails,
    user_id,
    handleViewInvoiceHistory
  )

  useEffect(() => {
    const fetchUserId = async () => {
      await setUserName(session?.user?.username)
      await setUser_id(session?.user?._id)
    }
    fetchUserId()
  }, [session])

  useEffect(() => {
    if (!user_id) return
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `/api/getUserDetails?user_id=${user_id}`
        )
        setUserDetail(response.data.userDetail)
      } catch (error) {
        console.error('Error fetching userDetails', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch Details',
          variant: 'destructive',
        })
      }
    }
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `/api/getUserBusinesses?user_id=${user_id}`
        )
        console.log(response)

        setBusinesses(response.data.businesses)

        if (response.data.businesses.length > 0 && !selectedBusinessId) {
          const firstBusinessId = response.data.businesses[0]._id

          setSelectedBusinessId(firstBusinessId)

          setBusinessDetails({
            ...businessDetails,
            _id: response.data.businesses[0]._id,
            name: response.data.businesses[0].name,
            contact: response.data.businesses[0].contact,
            address: response.data.businesses[0].address,
            description: response.data.businesses[0].description,
            gstNumber: response.data.businesses[0].gst_number,
          })

          setClients(response.data.businesses[0].clients)
          setItems(response.data.businesses[0].items)
        }
      } catch (error) {
        console.error('Error fetching businesses', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch businesses',
          variant: 'destructive',
        })
      }
    }

    if (session) {
      fetchBusinesses()
      fetchUserDetails()
    }
    if (fetchBusinesses && fetchUserDetails) {
      handleViewInvoiceHistory(selectedBusinessId)
    }
  }, [session, user_id, selectedBusinessId])

  const filteredAndSortedPayments = useMemo(() => {
    return invoiceHistory
      .filter((invoice) => {
        const matchesSearch = 
          invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesClient = selectedClient === 'all' || invoice.client.name === selectedClient
        const matchesStatus = statusFilter === 'all' ? true :
          statusFilter === 'unpaid' ? invoice.paymentStatus !== 'Paid' && invoice.paymentStatus !== 'paid' :
          invoice.paymentStatus.toLowerCase() === statusFilter.toLowerCase()
        
        const invoiceDate = new Date(invoice.billDate)
        invoiceDate.setHours(0, 0, 0, 0) // Set to start of day
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0) // Set to start of day
        const matchesDate = dateFilter === 'all' || (
          dateFilter === 'thisMonth' ? 
            invoiceDate.getMonth() === currentDate.getMonth() && invoiceDate.getFullYear() === currentDate.getFullYear() :
          dateFilter === 'lastMonth' ? 
            (invoiceDate.getMonth() === currentDate.getMonth() - 1 && invoiceDate.getFullYear() === currentDate.getFullYear()) ||
            (currentDate.getMonth() === 0 && invoiceDate.getMonth() === 11 && invoiceDate.getFullYear() === currentDate.getFullYear() - 1) :
          dateFilter === 'thisYear' ? 
            invoiceDate.getFullYear() === currentDate.getFullYear() :
          dateFilter === 'custom' ? 
            (!dateRange.from || invoiceDate >= dateRange.from) && 
            (!dateRange.to || invoiceDate <= dateRange.to) :
          true
        )
        return matchesSearch && matchesClient && matchesStatus && matchesDate
      })
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
  }, [invoiceHistory, searchTerm, sortField, sortDirection, selectedClient, statusFilter, dateFilter, dateRange])

  const handleSort = (field: keyof Invoice) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const uniqueClients = useMemo(() => {
    return ['all', ...clients.map(client => client.name)].sort()
  }, [clients])

  const totalAmount = filteredAndSortedPayments.reduce((sum, payment) => sum + payment.total_amount, 0)

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedClient('all')
    setStatusFilter('unpaid')
    setDateFilter('all')
    setDateRange({ from: null, to: null })
  }

  return (
    <div className="space-y-6">
      <Header />
      <BusinessSelector
        businesses={businesses}
        selectedBusinessId={selectedBusinessId}
        onBusinessChange={handleBusinessChange}
      />
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
            <div className="text-2xl font-bold">{filteredAndSortedPayments.length}</div>
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
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="lastMonth">Last Month</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {dateFilter === 'custom' && (
                <DateRangePicker
                  value={dateRange}
                  onChange={(newDateRange) => {
                    setDateRange(newDateRange);
                  }}
                  className="w-[300px]"
                />
              )}
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by client" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueClients.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client === 'all' ? 'All Clients' : client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={clearFilters} variant="outline" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          </div>
          <Tabs defaultValue="incoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="incoming"
                onClick={() => setActiveType('incoming')}>
                Incoming
              </TabsTrigger>
              <TabsTrigger
                value="outgoing"
                onClick={() => setActiveType('outgoing')}>
                Outgoing
              </TabsTrigger>
            </TabsList>
            <TabsContent value="incoming">
              <PaymentTable
                payments={filteredAndSortedPayments}
                type="incoming"
                businessDetails={businessDetails}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </TabsContent>
            <TabsContent value="outgoing">
              <PaymentTable
                payments={[]}
                type="outgoing"
                businessDetails={businessDetails}
                onSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function PaymentTable({
  payments,
  type,
  businessDetails,
  onSort,
  sortField,
  sortDirection,
}: {
  payments: Invoice[]
  type: PaymentType
  businessDetails: BusinessDetails
  onSort: (field: keyof Invoice) => void
  sortField: keyof Invoice
  sortDirection: 'asc' | 'desc'
}) {
  const shareOnWhatsApp = (invoice: Invoice) => {
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

  const initiatePhoneCall = (invoice: Invoice) => {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => onSort('invoice_number')} className="cursor-pointer">
            {type === 'incoming' ? 'Invoice' : 'Bill'}
            {sortField === 'invoice_number' && (
              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
            )}
          </TableHead>
          <TableHead onClick={() => onSort('client.name')} className="cursor-pointer">
            {type === 'incoming' ? 'Client' : 'Vendor'}
            {sortField === 'client.name' && (
              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
            )}
          </TableHead>
          <TableHead onClick={() => onSort('billDate')} className="cursor-pointer">
            Due Date
            {sortField === 'billDate' && (
              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
            )}
          </TableHead>
          <TableHead onClick={() => onSort('total_amount')} className="cursor-pointer">
            Amount
            {sortField === 'total_amount' && (
              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
            )}
          </TableHead>
          <TableHead onClick={() => onSort('paymentStatus')} className="cursor-pointer">
            Status
            {sortField === 'paymentStatus' && (
              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} />
            )}
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((invoice) => (
          <TableRow key={invoice._id}>
            <TableCell className="font-medium">
              {invoice.invoice_number}
            </TableCell>
            <TableCell>{invoice.client.name || 'N/A'}</TableCell>
            <TableCell>
              {new Date(invoice.billDate).toLocaleDateString()}
            </TableCell>
            <TableCell>₹{invoice.total_amount.toFixed(2)}</TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                {invoice.paymentStatus}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => initiatePhoneCall(invoice)}>
                  <Phone className="h-4 w-4" />
                  <span className="sr-only">Call Client</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => shareOnWhatsApp(invoice)}>
                  <MessageCircle className="h-4 w-4" />
                  <span className="sr-only">Share on WhatsApp</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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

