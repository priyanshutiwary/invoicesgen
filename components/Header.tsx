'use client'

import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Clock, ChevronDown, UserCircle, Plus, Menu, LayoutDashboard, FileText, Users, LogOut } from "lucide-react"
import { BusinessDetails, Invoice } from '@/backend/types/type'
import { InvoiceHistory } from './invoiceHistory'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface HeaderProps {
  userName: string | undefined
  businessDetails: BusinessDetails
  invoiceHistory: Invoice[]
  handleViewInvoiceHistory: (businessId: string) => Promise<void>
  handleViewInvoice: (invoice: Invoice) => void
  handleLogout: () => Promise<void>
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleCreateBusiness: () => void
  handleMarkPaid: (invoiceId: string) => Promise<void>
  handleExtendDate: (invoiceId: string, newDate: Date) => Promise<void>
}

export function Header({
  userName = "User",
  businessDetails = { _id: "", name: "Business" },
  invoiceHistory = [],
  handleViewInvoiceHistory,
  handleViewInvoice,
  handleLogout,
  setIsProfileOpen,
  handleCreateBusiness,
  handleMarkPaid,
  handleExtendDate
}: HeaderProps) {
  const [isInvoiceHistoryOpen, setIsInvoiceHistoryOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setIsInvoiceHistoryOpen(false);
    }
  }, [isMobile]);

  const openInvoiceHistory = async () => {
    if (isMobile) {
      setIsSheetOpen(false);
    }
    setIsInvoiceHistoryOpen(true);
    if (businessDetails._id) {
      await handleViewInvoiceHistory(businessDetails._id);
    }
  };

  const handleMenuItemClick = (action: () => void) => {
    if (isMobile) {
      setIsSheetOpen(false)
    }
    action()
  }

  const MenuItems = ({ isMobile = false }) => (
    <div className={`flex flex-col ${isMobile ? 'space-y-4' : ''}`}>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => handleMenuItemClick(() => setIsProfileOpen(true))}
      >
        <LayoutDashboard className="w-5 h-5 mr-3" />
        Business details
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => handleMenuItemClick(handleCreateBusiness)}
      >
        <Plus className="w-5 h-5 mr-3" />
        Create new business
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => handleMenuItemClick(() => setIsProfileOpen(true))}
      >
        <UserCircle className="w-5 h-5 mr-3" />
        Profile
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100" 
        onClick={() => handleMenuItemClick(handleLogout)}
      >
        <LogOut className="w-5 h-5 mr-3" />
        Logout
      </Button>
    </div>
  )

  // Skeleton loader for the header
  const HeaderSkeleton = () => (
    <div className="bg-blue-600">
      <header className="bg-blue-600 shadow-md text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">
              Business Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )

  if (!isMounted) {
    return <HeaderSkeleton />
  }

  return (
    <div className="bg-blue-600">
      <header className="bg-blue-600 shadow-md text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">
              Business Dashboard
            </h1>
            <div className="flex items-center">
              {isMobile ? (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent 
                    side="bottom" 
                    className="h-[80vh] rounded-t-3xl pt-6"
                  >
                    <SheetHeader>
                      <SheetTitle className="text-left">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col space-y-4 mt-6 overflow-y-auto max-h-[calc(80vh-4rem)]">
                      <div className="flex items-center space-x-4 px-2">
                        <Avatar>
                          <AvatarImage src={`https://avatar.vercel.sh/${userName}.png`} alt={userName} />
                          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{userName}</p>
                          <p className="text-sm text-muted-foreground">{businessDetails.name}</p>
                        </div>
                      </div>
                      <Separator />
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={openInvoiceHistory}
                      >
                        <Clock className="w-5 h-5 mr-3" />
                        Invoice History
                      </Button>
                      <MenuItems isMobile={true} />
                    </div>
                  </SheetContent>
                </Sheet>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-2 text-white hover:bg-blue-700 rounded-full px-4 py-2"
                      onClick={openInvoiceHistory}
                    >
                      <Clock className="w-5 h-5 mr-1" />
                      Invoice History
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-blue-700 rounded-full px-2 py-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${userName}.png`} alt={userName} />
                            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="ml-2 mr-1">{userName}</span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="flex flex-col space-y-1 p-2">
                          <p className="text-sm font-medium">{userName}</p>
                          <p className="text-xs text-muted-foreground">{businessDetails.name}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <MenuItems />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <InvoiceHistory
        isOpen={isInvoiceHistoryOpen}
        setIsOpen={setIsInvoiceHistoryOpen}
        invoiceHistory={invoiceHistory}
        businessDetails={businessDetails}
        handleViewInvoice={handleViewInvoice}
        handleMarkPaid={handleMarkPaid}
        handleExtendDate={handleExtendDate}
        handleViewInvoiceHistory={handleViewInvoiceHistory}
      />
    </div>
  )
}