import { useState } from 'react'
import { Invoice } from '@/backend/types/type'

export function usePaymentFilters() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Invoice>('billDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedClient, setSelectedClient] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('unpaid')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedClient('all')
    setStatusFilter('unpaid')
    setDateFilter('all')
    setDateRange({ from: null, to: null })
  }

  return {
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
  }
}

