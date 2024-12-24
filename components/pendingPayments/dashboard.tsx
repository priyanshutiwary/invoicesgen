
'use client'

import { useState, useEffect, useMemo } from 'react'
import { Calendar, DollarSign } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from './header'
import { toast } from '@/components/ui/use-toast'
import { signOut, useSession } from 'next-auth/react'
import BusinessSelector from '../businessSelector'
import {
  BusinessDetails,
  Client,
  Item,
  Invoice,
  Business,
  UserProfile,
} from '@/backend/types/type'
import { useBusinessHandlers } from '@/handler/businessHandler'
import { useInvoiceHandler } from '@/handler/invoiceHandler'
import { FilterBar } from './filterBar'
import { PaymentTable } from './paymentTable'
import { usePaymentFilters } from './filters/usePaymentFilters'
import { InvoicePreview } from '@/components/InvoicePreview'
import { usePDF } from 'react-to-pdf'

export default function PendingPayments() {
  const [activeType, setActiveType] = useState<'incoming' | 'outgoing'>('incoming')
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
  const { toPDF, targetRef } = usePDF({ filename: 'invoice.pdf' })
  const [clients, setClients] = useState<Client[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [invoiceHistory, setInvoiceHistory] = useState<Invoice[]>([])
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false)
  const [isViewHistoryInvoice, setIsViewHistoryInvoice] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)

  const {
    handleSaveInvoice,
    handleViewInvoiceHistory,
    handleExtendDate,
    handleMarkPayment,
    handleDeleteInvoice,
  } = useInvoiceHandler(
    setInvoiceHistory,
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

  const {
    searchTerm,
    setSearchTerm,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    selectedClient,
    setSelectedClient,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    dateRange,
    setDateRange,
    clearFilters,
  } = usePaymentFilters()

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

  

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/sign-in'
  }
  const handleEditInvoice = () => {
    setIsInvoicePreviewOpen(false)
    setIsInvoiceOpen(true)
}

const handleCloseInvoicePreview = () => {
    setIsInvoicePreviewOpen(false)
    setIsViewHistoryInvoice(false)
}
const handleViewInvoice = (invoice: Invoice) => {
    console.log('current invoice here', currentInvoice)

    console.log('before enhancing', invoice)

    setCurrentInvoice(invoice)

    setIsInvoicePreviewOpen(true)
    setIsViewHistoryInvoice(true)
}



  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100 dark:bg-gray-900 ">
      <Header userName={userName} />
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto dark:bg-gray-800">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          
        </h1>
        <BusinessSelector
          businesses={businesses}
          selectedBusinessId={selectedBusinessId}
          onBusinessChange={handleBusinessChange}
        />

        <InvoicePreview
				selectedBusinessId={selectedBusinessId}
				isInvoicePreviewOpen={isInvoicePreviewOpen}
				setIsInvoicePreviewOpen={setIsInvoicePreviewOpen}
				currentInvoice={currentInvoice}
				businessDetails={businessDetails}
				targetRef={targetRef}
				toPDF={toPDF}
				onEdit={handleEditInvoice}
				onSave={handleSaveInvoice}
				onClose={handleCloseInvoicePreview}
				onDelete={handleDeleteInvoice}
				clients={clients}
				setInvoiceHistory={setInvoiceHistory}
				setCurrentInvoice={setCurrentInvoice}
				isViewInvoiceHistory={isViewHistoryInvoice}
			/>

      </div>
      <div className="w-full">
        <Button
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={() => {
            window.location.href = `/`;
          }}>
          Dashboard
        </Button>
      </div>
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
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            uniqueClients={uniqueClients}
            clearFilters={clearFilters}
          />
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
      </main>
    </div>
  )
}

