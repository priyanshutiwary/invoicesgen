'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Header } from '@/components/Header'
import { DashboardCards } from '@/components/DashboardCards'
import { InvoiceGeneration } from '@/components/InvoiceGeneration'
import { ClientManagement } from '@/components/ClientManagement'
import { ItemManagement } from '@/components/ItemManagement'
import { BusinessProfile } from '@/components/BusinessProfile'
import { InvoicePreview } from '@/components/InvoicePreview'
import { EditClientDialog } from '@/components/EditClientDialog'
import { EditItemDialog } from '@/components/EditItemDialog'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { usePDF } from 'react-to-pdf'
import { toast } from "@/components/ui/use-toast"
import { signOut } from 'next-auth/react'
import { useParams } from 'next/navigation'
export default function Dashboard() {
  const params = useParams<{ username: string }>();

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isClientOpen, setIsClientOpen] = useState(false)
  const [isItemOpen, setIsItemOpen] = useState(false)
  const [isEditClientOpen, setIsEditClientOpen] = useState(false)
  const [isEditItemOpen, setIsEditItemOpen] = useState(false)
  const [isManageClientsOpen, setIsManageClientsOpen] = useState(false)
  const [isManageItemsOpen, setIsManageItemsOpen] = useState(false)
  const [businessDetails, setBusinessDetails] = useState({
    name: "Acme Corp",
    email: "info@acmecorp.com",
    address: "123 Business St, City, Country",
    description: "Leading provider of innovative solutions",
    gstNumber: "27AADCB2230M1Z3"
  })
  const [invoiceItems, setInvoiceItems] = useState([])
  const [clients, setClients] = useState([
    { id: 1, name: "Client A", email: "clienta@example.com", phone: "1234567890", gstNumber: "29ABCDE1234F1Z5" },
    { id: 2, name: "Client B", email: "clientb@example.com", phone: "0987654321", gstNumber: "27FGHIJ5678K2Z3" }
  ])
  const [editingClient, setEditingClient] = useState(null)
  const [items, setItems] = useState([
    { id: 1, name: "Item 1", description: "Description for Item 1", price: 100, tax: 5 },
    { id: 2, name: "Item 2", description: "Description for Item 2", price: 200, tax: 10 },
    { id: 3, name: "Item 3", description: "Description for Item 3", price: 300, tax: 18 }
  ])
  const [editingItem, setEditingItem] = useState(null)
  const [currentInvoice, setCurrentInvoice] = useState(null)
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false)
  const [invoiceHistory, setInvoiceHistory] = useState([
    {
      id: 1,
      number: 'INV-001',
      client: { name: 'Client A', email: 'clienta@example.com', gstNumber: '29ABCDE1234F1Z5' },
      date: '2023-09-15',
      dueDate: '2023-10-15',
      amount: 5000,
      items: [
        { id: 1, name: 'Item 1', quantity: 2, price: 2000, tax: 5 },
        { id: 2, name: 'Item 2', quantity: 1, price: 1000, tax: 5 }
      ],
      isItemwiseTax: true,
      totalTaxRate: 5
    },
    {
      id: 2,
      number: 'INV-002',
      client: { name: 'Client B', email: 'clientb@example.com', gstNumber: '27FGHIJ5678K2Z3' },
      date: '2023-09-20',
      dueDate: '2023-10-20',
      amount: 7500,
      items: [
        { id: 1, name: 'Item 3', quantity: 1, price: 7500, tax: 18 }
      ],
      isItemwiseTax: true,
      totalTaxRate: 18
    }
  ])

  const { toPDF, targetRef } = usePDF({filename: 'invoice.pdf'})

  const handleBusinessDetailsChange = useCallback((e) => {
    setBusinessDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const handleSaveBusinessDetails = useCallback(() => {
    console.log("Saving business details:", businessDetails)
  }, [businessDetails])

  const handleAddClient = useCallback((e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newClient = {
      id: Date.now(),
      name: formData.get('clientName'),
      email: formData.get('clientEmail'),
      phone: formData.get('clientPhone'),
      gstNumber: formData.get('clientGstNumber')
    }
    setClients(prev => [...prev, newClient])
    setIsClientOpen(false)
  }, [])

  const handleEditClient = useCallback((e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updatedClient = {
      id: editingClient.id,
      name: formData.get('clientName'),
      email: formData.get('clientEmail'),
      phone: formData.get('clientPhone'),
      gstNumber: formData.get('clientGstNumber')
    }
    setClients(prev => prev.map(client => client.id === updatedClient.id ? updatedClient : client))
    setIsEditClientOpen(false)
    setEditingClient(null)
  }, [editingClient])

  const handleDeleteClient = useCallback((id) => {
    setClients(prev => prev.filter(client => client.id !== id))
  }, [])

  const handleAddItem = useCallback((e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newItem = {
      id: Date.now(),
      name: formData.get('itemName'),
      description: formData.get('itemDescription'),
      price: parseFloat(formData.get('itemPrice')),
      tax: parseFloat(formData.get('itemTax'))
    }
    setItems(prev => [...prev, newItem])
    setIsItemOpen(false)
  }, [])

  const handleEditItem = useCallback((e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updatedItem = {
      id: editingItem.id,
      name: formData.get('itemName'),
      description: formData.get('itemDescription'),
      price: parseFloat(formData.get('itemPrice')),
      tax: parseFloat(formData.get('itemTax'))
    }
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item))
    setIsEditItemOpen(false)
    setEditingItem(null)
  }, [editingItem])

  const handleDeleteItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const handleViewInvoiceHistory = useCallback((invoice) => {
    const fullInvoice = invoiceHistory.find(inv => inv.number === invoice.number)
    if (fullInvoice) {
      setCurrentInvoice(fullInvoice)
      setIsInvoicePreviewOpen(true)
    } else {
      toast({
        title: "Error",
        description: `Invoice ${invoice.number} not found`,
        variant: "destructive",
      })
    }
  }, [invoiceHistory])

  const handleLogout = useCallback(async () => {
    await signOut()
    window.location.href = '/sign-in'
  }, [])

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      <Header 
        businessDetails={businessDetails} 
        invoiceHistory={invoiceHistory} 
        handleViewInvoiceHistory={handleViewInvoiceHistory}
        handleLogout={handleLogout}
        setIsProfileOpen={setIsProfileOpen}
      />
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
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
      />
    </div>
  )
}