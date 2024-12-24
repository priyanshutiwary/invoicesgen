import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateRangePicker } from '@/components/pendingPayments/filters/date-picker'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

interface FilterBarProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  dateFilter: string
  setDateFilter: (value: string) => void
  dateRange: { from: Date | null; to: Date | null }
  setDateRange: (value: { from: Date | null; to: Date | null }) => void
  selectedClient: string
  setSelectedClient: (value: string) => void
  uniqueClients: string[]
  clearFilters: () => void
}

export function FilterBar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  dateRange,
  setDateRange,
  selectedClient,
  setSelectedClient,
  uniqueClients,
  clearFilters,
}: FilterBarProps) {
  return (
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
          Clear
        </Button>
      </div>
    </div>
  )
}

