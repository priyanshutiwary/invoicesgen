/** @format */

'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { DashboardCards } from '@/components/DashboardCards'
import { InvoiceGeneration } from '@/components/InvoiceGeneration'
import { ClientManagement } from '@/components/ClientManagement'
import { ItemManagement } from '@/components/ItemManagement'
import { BusinessProfile } from '@/components/BusinessProfile'
import { InvoicePreview } from '@/components/InvoicePreview'
import { EditClientDialog } from '@/components/EditClientDialog'
import { EditItemDialog } from '@/components/EditItemDialog'
import { CreateBusinessPopup } from '@/components/createBusiness'
// import {invoiceViewer} from '@/components/invoiceViewer'
import { usePDF } from 'react-to-pdf'
import { toast } from '@/components/ui/use-toast'
import { signOut, useSession } from 'next-auth/react'
import { ApiResponse } from '@/backend/types/ApiResponse'
import axios from 'axios'
import BusinessSelector from '@/components/businessSelector'
import { useBusinessHandlers } from '@/handler/businessHandler'
import { useClientHandlers } from '@/handler/clientHandler'
import { useItemHandlers } from '@/handler/itemHandlers'
import { useInvoiceHandler } from '@/handler/invoiceHandler'
import { useCreateBusinessHandler } from '@/handler/createBusiness'
import {
	BusinessDetails,
	Client,
	Item,
	Invoice,
	Business,
	InvoiceItem,
	UserProfile,
} from '@/backend/types/type'

export default function Dashboard() {
	const { data: session } = useSession()
	const [userDetail, setUserDetail] = useState<UserProfile[]>([])
	const [userName, setUserName] = useState<string | undefined>(undefined)
	const [user_id, setUser_id] = useState<string | undefined>(undefined)
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

	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
	const [isClientOpen, setIsClientOpen] = useState(false)
	const [isItemOpen, setIsItemOpen] = useState(false)
	const [isEditClientOpen, setIsEditClientOpen] = useState(false)
	const [isEditItemOpen, setIsEditItemOpen] = useState(false)
	const [isManageClientsOpen, setIsManageClientsOpen] = useState(false)
	const [isManageItemsOpen, setIsManageItemsOpen] = useState(false)
	const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
	const [editingClient, setEditingClient] = useState<Client | null>(null)
	const [editingItem, setEditingItem] = useState<Item | null>(null)
	const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
	const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false)
	const [isViewHistoryInvoice, setIsViewHistoryInvoice] = useState(false)

	const [invoiceData, setInvoiceData] = useState<{
		clientId: string
		isNewClient: boolean
		newClient: { name: string; contact: string; gstNumber: string }
		isItemwiseTax: boolean
		totalTaxRate: number
		paymentStatus: 'paid' | 'due' | 'duedate'
		dueDate: string
		billDate: string
	}>({
		clientId: '',
		isNewClient: false,
		newClient: { name: '', contact: '', gstNumber: '' },
		isItemwiseTax: true,
		totalTaxRate: 18,
		paymentStatus: 'due',
		dueDate: '',
		billDate: new Date().toISOString().split('T')[0],
	})

	const { toPDF, targetRef } = usePDF({ filename: 'invoice.pdf' })

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
		user_id
	)
	const { handleAddClient, handleEditClient, handleDeleteClient } =
		useClientHandlers(
			selectedBusinessId,
			setClients,
			setIsClientOpen,
			setIsEditClientOpen,
			setEditingClient
		)
	const { handleAddItem, handleEditItem, handleDeleteItem } = useItemHandlers(
		items,
		selectedBusinessId,
		setItems,
		setIsItemOpen,
		setIsEditItemOpen,
		setEditingItem
	)
	const {
		handleSaveInvoice,
		handleViewInvoiceHistory,
		handleExtendDate,
		handleMarkPayment,
	} = useInvoiceHandler(
		setInvoiceHistory,
		setIsInvoicePreviewOpen,
		setCurrentInvoice
	)
	const {
		isCreateBusinessOpen,
		setIsCreateBusinessOpen,
		newBusinessDetails,
		handleCreateBusinessClick,
		handleNewBusinessDetailsChange,
		handleSaveNewBusiness,
		isLoading,
	} = useCreateBusinessHandler(user_id, setBusinesses, setSelectedBusinessId)

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
				setBusinesses(response.data.businesses)

				if (response.data.businesses.length > 0 && !selectedBusinessId) {
					setSelectedBusinessId(response.data.businesses[0]._id)

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
					setInvoiceHistory(response.data.businesses[0])
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
	}, [session, user_id, selectedBusinessId])

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
		console.log('before enhancing', invoice)

		try {
			// Create a new object instead of using JSON.parse/stringify
			const enrichedInvoice: Invoice = {
				...invoice,
				items: [...invoice.items], // Create a new array for items
				client: undefined, // Initialize client as undefined
			}

			// Find and add client details
			const matchingClient = clients.find(
				(clients) => clients._id === invoice.client
			)
			console.log(matchingClient)

			if (matchingClient) {
				enrichedInvoice.client = matchingClient
			}

			enrichedInvoice.items = enrichedInvoice.items.map((invoiceItem) => {
				const matchingItem = items.find(
					(items) => items._id === invoiceItem.item
				)
				console.log('Matching item:', matchingItem)

				if (matchingItem) {
					return {
						...invoiceItem,
						name: matchingItem.name,
						tax: matchingItem.tax || invoiceItem.tax, // Use existing tax if matching item's tax is undefined
					}
				}
				return invoiceItem
			})

			console.log('Enriched Invoice:', enrichedInvoice)

			setCurrentInvoice(enrichedInvoice)
			setIsInvoicePreviewOpen(true)
			setIsViewHistoryInvoice(true)
		} catch (error) {
			console.error('Error processing invoice:', error)
			// Handle error appropriately (maybe show a notification to user)
		}
	}

	return (
		<div className="flex flex-col w-full min-h-screen bg-gray-100">
			<Header
				userName={userName}
				businessDetails={businessDetails}
				invoiceHistory={invoiceHistory}
				handleViewInvoiceHistory={handleViewInvoiceHistory}
				handleViewInvoice={handleViewInvoice}
				handleDeleteBusiness={handleDeleteBusiness}
				handleLogout={handleLogout}
				setIsProfileOpen={setIsProfileOpen}
				handleCreateBusiness={handleCreateBusinessClick}
				handleMarkPaid={handleMarkPayment}
				handleExtendDate={handleExtendDate}
				userProfile={userDetail}
				businesses={businesses}
			/>
			<main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">Dashboard</h1>
					<BusinessSelector
						businesses={businesses}
						selectedBusinessId={selectedBusinessId}
						onBusinessChange={handleBusinessChange}
					/>
				</div>
				<DashboardCards />
				<div className="grid gap-6 md:grid-cols-3">
					<InvoiceGeneration
						isInvoiceOpen={isInvoiceOpen}
						setIsInvoiceOpen={setIsInvoiceOpen}
						invoiceItems={invoiceItems}
						setInvoiceItems={setInvoiceItems}
						clients={clients}
						items={items}
						setCurrentInvoice={setCurrentInvoice}
						setIsInvoicePreviewOpen={setIsInvoicePreviewOpen}
						invoiceData={invoiceData}
						setInvoiceData={setInvoiceData}
						setIsViewHistoryInvoice={setIsViewHistoryInvoice}
					/>
					<ClientManagement
						isClientOpen={isClientOpen}
						setIsClientOpen={setIsClientOpen}
						isManageClientsOpen={isManageClientsOpen}
						setIsManageClientsOpen={setIsManageClientsOpen}
						clients={clients}
						handleAddClient={handleAddClient}
						handleDeleteClient={handleDeleteClient}
						setEditingClient={setEditingClient}
						setIsEditClientOpen={setIsEditClientOpen}
					/>
					<ItemManagement
						isItemOpen={isItemOpen}
						setIsItemOpen={setIsItemOpen}
						isManageItemsOpen={isManageItemsOpen}
						setIsManageItemsOpen={setIsManageItemsOpen}
						items={items}
						handleAddItem={handleAddItem}
						handleDeleteItem={handleDeleteItem}
						setEditingItem={setEditingItem}
						setIsEditItemOpen={setIsEditItemOpen}
					/>
				</div>
			</main>
			<BusinessProfile
				isProfileOpen={isProfileOpen}
				setIsProfileOpen={setIsProfileOpen}
				businessDetails={businessDetails}
				handleBusinessDetailsChange={handleBusinessDetailsChange}
				handleSaveBusinessDetails={handleSaveBusinessDetails}
				handleDeleteBusiness={handleDeleteBusiness}
			/>
			<EditClientDialog
				isEditClientOpen={isEditClientOpen}
				setIsEditClientOpen={setIsEditClientOpen}
				editingClient={editingClient}
				handleEditClient={handleEditClient}
			/>
			<EditItemDialog
				isEditItemOpen={isEditItemOpen}
				setIsEditItemOpen={setIsEditItemOpen}
				editingItem={editingItem}
				handleEditItem={handleEditItem}
			/>
			<InvoicePreview
				isInvoicePreviewOpen={isInvoicePreviewOpen}
				setIsInvoicePreviewOpen={setIsInvoicePreviewOpen}
				currentInvoice={currentInvoice}
				businessDetails={businessDetails}
				targetRef={targetRef}
				toPDF={toPDF}
				onEdit={handleEditInvoice}
				onSave={handleSaveInvoice}
				onClose={handleCloseInvoicePreview}
				clients={clients}
				setInvoiceHistory={setInvoiceHistory}
				setCurrentInvoice={setCurrentInvoice}
				isViewInvoiceHistory={isViewHistoryInvoice}
			/>
			{/* <InvoiceViewer
        invoice={currentInvoice}
        client={clients.find(client => client._id === currentInvoice?.clientId) || null}
        isOpen={isInvoiceViewerOpen}
        onClose={() => setIsInvoiceViewerOpen(false)}
      /> */}
			<CreateBusinessPopup
				isOpen={isCreateBusinessOpen}
				onClose={() => setIsCreateBusinessOpen(false)}
				businessDetails={newBusinessDetails}
				handleBusinessDetailsChange={handleNewBusinessDetailsChange}
				handleSaveBusinessDetails={handleSaveNewBusiness}
				user_id={user_id}
				isLoading={isLoading}
			/>
		</div>
	)
}
