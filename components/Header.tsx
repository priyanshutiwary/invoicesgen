import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Clock, ChevronDown, UserCircle, Plus, ChevronLeft, ChevronRight, Edit, CheckCircle, RefreshCw, Eye, Calendar, Search, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BusinessDetails {
  _id: string;
  name: string;
}

interface Invoice {
  _id: string;
  invoice_number: string;
  billDate: string;
  invoice_date: string;
  dueDate?: string;
  total_amount: number;
  paymentStatus: string;
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
  handleMarkPaid: (invoiceId: string) => Promise<void>;
  handleExtendDate: (invoiceId: string, newDate: Date) => Promise<void>;
}

export function Header({ 
  userName = "User", 
  businessDetails = { _id: "", name: "Business" }, 
  invoiceHistory = [], 
  handleViewInvoiceHistory = async () => {}, 
  handleViewInvoice = () => {},
  handleEditInvoice = () => {},
  handleLogout = async () => {}, 
  setIsProfileOpen = () => {},
  handleCreateBusiness = () => {},
  handleMarkPaid = async () => {},
  handleExtendDate = async () => {}
}: HeaderProps) {
  const [isInvoiceHistoryOpen, setIsInvoiceHistoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedInvoices, setLoadedInvoices] = useState<Invoice[]>([]);
  const [extendDateDialogOpen, setExtendDateDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [newDueDate, setNewDueDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedInvoices, setHasLoadedInvoices] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);

  const itemsPerPage = 5;

  const refreshInvoiceHistory = useCallback(async () => {
    if (businessDetails._id) {
      setIsLoading(true);
      await handleViewInvoiceHistory(businessDetails._id);
      setIsLoading(false);
      setHasLoadedInvoices(true);
    }
  }, [businessDetails._id, handleViewInvoiceHistory]);

  useEffect(() => {
    if (invoiceHistory.length > 0) {
      const sortedInvoices = [...invoiceHistory].sort((a, b) => {
        const aNumber = parseInt(a.invoice_number.split('-')[1]);
        const bNumber = parseInt(b.invoice_number.split('-')[1]);
        return bNumber - aNumber;
      });
      setLoadedInvoices(sortedInvoices);
      setFilteredInvoices(sortedInvoices);
    }
  }, [invoiceHistory]);

  useEffect(() => {
    const filtered = loadedInvoices.filter(invoice => 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(filtered);
    setCurrentPage(1);
  }, [searchTerm, loadedInvoices]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const openInvoiceHistory = async () => {
    setIsInvoiceHistoryOpen(true);
    await refreshInvoiceHistory();
  };

  const handleManualRefresh = async () => {
    setIsLoading(true);
    setHasLoadedInvoices(false);
    await refreshInvoiceHistory();
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusWithDueDate = (invoice: Invoice) => {
    if (invoice.paymentStatus === 'duedate') {
      return `due on ${formatDate(invoice.dueDate)}`;
    } else if (invoice.paymentStatus === 'due') {
      return 'due';
    }
    return invoice.paymentStatus;
  };

  const openExtendDateDialog = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setExtendDateDialogOpen(true);
  };

  const handleExtendDateConfirm = async () => {
    if (selectedInvoiceId && newDueDate) {
      await handleExtendDate(selectedInvoiceId, newDueDate);
      setExtendDateDialogOpen(false);
      setSelectedInvoiceId(null);
      setNewDueDate(undefined);
      await handleManualRefresh();
    }
  };

  return (
    <div className=" bg-gradient-to-b from-gray-100 to-gray-200">
      <header className="bg-white shadow-md">
        <div className="min-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              Business Dashboard
            </h1>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <Button 
                variant="default" 
                className="w-full md:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={openInvoiceHistory}
              >
                <Clock className="w-5 h-5" />
                Invoice History
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto flex items-center gap-2">
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
          </div>
        </div>
      </header>

      {/* <main className="min-w-full mx-auto  sm:px-6  top-py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">Welcome, {userName}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Manage your invoices and business details with ease.</p>
          </CardContent>
        </Card>
      </main> */}

      <Dialog open={isInvoiceHistoryOpen} onOpenChange={setIsInvoiceHistoryOpen}>
        <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Invoice History</DialogTitle>
            <DialogDescription className="text-gray-600">
              All invoices generated by {businessDetails.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            <span className="text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          {filteredInvoices.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] bg-gray-50 text-gray-600">Invoice</TableHead>
                    <TableHead className="w-[100px] bg-gray-50 text-gray-600">Date</TableHead>
                    <TableHead className="w-[100px] bg-gray-50 text-gray-600">Amount</TableHead>
                    <TableHead className="w-[100px] bg-gray-50 text-gray-600">Status</TableHead>
                    <TableHead className="w-[200px] bg-gray-50 text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentInvoices.map((invoice) => (
                    <TableRow key={invoice._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">{invoice.invoice_number}</TableCell>
                      <TableCell className="text-gray-600">{formatDate(invoice.billDate || invoice.invoice_date)}</TableCell>
                      <TableCell className="text-gray-900">₹{invoice.total_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-600">{getStatusWithDueDate(invoice)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => {
                              handleViewInvoice(invoice);
                              setIsInvoiceHistoryOpen(false);
                            }}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-800"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => {
                              handleEditInvoice(invoice);
                              setIsInvoiceHistoryOpen(false);
                            }}
                            className="bg-green-100 hover:bg-green-200 text-green-800"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          {(invoice.paymentStatus === 'due' || invoice.paymentStatus === 'duedate') && (
                            <>
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => handleMarkPaid(invoice._id)}
                                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                              >
                                <DollarSign className="w-4 h-4 mr-2" />
                                Mark Paid
                
                              </Button>
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => openExtendDateDialog(invoice._id)}
                                className="bg-purple-100 hover:bg-purple-200 text-purple-800"
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                {invoice.paymentStatus === 'due' ? 'Set Date' : 'Extend Date'}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-600 text-lg">
                {isLoading ? 'Loading invoices...' : 'No invoices found.'}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={extendDateDialogOpen} onOpenChange={setExtendDateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Set or Extend Due Date</DialogTitle>
            <DialogDescription className="text-gray-600">
              Select a new due date for this invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {newDueDate ? formatDate(newDueDate.toISOString()) : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={newDueDate}
                  onSelect={setNewDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button 
              onClick={handleExtendDateConfirm} 
              disabled={!newDueDate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirm New Due Date
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}