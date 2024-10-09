import React from 'react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, ChevronDown, UserCircle } from "lucide-react"

export function Header({ businessDetails, invoiceHistory, handleViewInvoiceHistory, handleLogout, setIsProfileOpen }) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between h-auto md:h-16 px-4 py-4 md:py-0 border-b bg-white shrink-0 md:px-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-0">Welcome to Your Business Dashboard</h1>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Invoice History
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {invoiceHistory.map((invoice) => (
              <DropdownMenuItem key={invoice.id} onSelect={() => handleViewInvoiceHistory(invoice)}>
                {invoice.number} - {invoice.client.name} (₹{invoice.amount.toFixed(2)})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
              <UserCircle className="w-5 h-5" />
              {businessDetails.name}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>My Account</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}