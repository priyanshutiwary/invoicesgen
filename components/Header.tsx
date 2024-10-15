import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, ChevronDown, UserCircle, Plus, ChevronLeft, ChevronRight, Edit } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface BusinessDetails {
  _id: string;
  name: string;
  email: string;
  address: string;
  description: string;
  gstNumber: string;
}

interface Invoice {
  _id: string;
  invoice_number: string;
  billDate: string;
  dueDate?: string;
  total_amount: number;
  paymentStatus: string;
  customerName: string; // Added customer name field
  items: {
    item: string;
    quantity: number;
    price: number;
    tax: number;
  }[];
  invoice_date?: string; // Added invoice_date field
}

interface HeaderProps {
  userName: string | undefined;
  businessDetails: BusinessDetails;
  invoiceHistory: Invoice[];
  handleViewInvoiceHistory: (businessId: string) => Promise<void>;
  handleViewInvoice: (invoice: Invoice) => void;
  handleEditInvoice: (invoice: Invoice) => void;
  handleLogout: () => Promise<void>;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateBusiness: () => void;
}

export function Header({ 
  userName, 
  businessDetails, 
  invoiceHistory, 
  handleViewInvoiceHistory, 
  handleViewInvoice,
  handleEditInvoice,
  handleLogout, 
  setIsProfileOpen,
  handleCreateBusiness
}: HeaderProps) {
  const [isInvoiceHistoryOpen, setIsInvoiceHistoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedInvoices, setLoadedInvoices] = useState<Invoice[]>([]);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(loadedInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = loadedInvoices.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  useEffect(() => {
    if (isInvoiceHistoryOpen && businessDetails._id) {
      handleViewInvoiceHistory(businessDetails._id).then(() => {
        // Sort invoices by invoice number in descending order
        const sortedInvoices = [...invoiceHistory].sort((a, b) => {
          const aNumber = parseInt(a.invoice_number.split('-')[1]);
          const bNumber = parseInt(b.invoice_number.split('-')[1]);
          return bNumber - aNumber;
        });
        setLoadedInvoices(sortedInvoices);
      });
    }
  }, [isInvoiceHistoryOpen, businessDetails._id, handleViewInvoiceHistory, invoiceHistory]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusWithDueDate = (invoice: Invoice) => {
    if (invoice.paymentStatus === 'due' && invoice.dueDate) {
      return `${invoice.paymentStatus} (${formatDate(invoice.dueDate)})`;
    }
    return invoice.paymentStatus;
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between h-auto md:h-16 px-4 py-4 md:py-0 border-b bg-white shrink-0 md:px-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-0">Welcome to Your Business Dashboard</h1>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <Button 
          variant="outline" 
          className="w-full md:w-auto flex items-center gap-2"
          onClick={() => setIsInvoiceHistoryOpen(true)}
        >
          <Clock className="w-5 h-5" />
          Invoice History
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
              <UserCircle className="w-5 h-5" />
              {userName}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>Business details</DropdownMenuItem>
            <DropdownMenuItem onSelect={handleCreateBusiness}>
              <Plus className="w-4 h-4 mr-2" />
              Create new business
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isInvoiceHistoryOpen} onOpenChange={setIsInvoiceHistoryOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Invoice History</DialogTitle>
            <DialogDescription>
              All invoices generated by {businessDetails.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInvoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{formatDate(invoice.billDate || invoice.invoice_date)}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>₹{invoice.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusWithDueDate(invoice)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          handleViewInvoice(invoice);
                          setIsInvoiceHistoryOpen(false);
                        }}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          handleEditInvoice(invoice);
                          setIsInvoiceHistoryOpen(false);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </header>
  )
}