'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'

interface DateRangePickerProps {
  className?: string
  value: {
    from: Date | null
    to: Date | null
  }
  onChange: (value: { from: Date | null; to: Date | null }) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [startDate, setStartDate] = React.useState<Date | null>(value.from)
  const [endDate, setEndDate] = React.useState<Date | null>(value.to)
  const [startOpen, setStartOpen] = React.useState(false)
  const [endOpen, setEndOpen] = React.useState(false)

  // Handle start date change
  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(0, 0, 0, 0)
      setStartDate(newDate)
      // Only update the parent if we have both dates or just the start date
      onChange({
        from: newDate,
        to: endDate
      })
    }
    setStartOpen(false)
  }

  // Handle end date change
  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(23, 59, 59, 999)
      setEndDate(newDate)
      // Only update the parent if we have both dates or just the end date
      onChange({
        from: startDate,
        to: newDate
      })
    }
    setEndOpen(false)
  }

  // Clear both dates
  const handleClear = () => {
    setStartDate(null)
    setEndDate(null)
    onChange({ from: null, to: null })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="grid gap-2">
        <Label htmlFor="start-date">Start Date</Label>
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <Button
              id="start-date"
              variant="outline"
              className={`w-[180px] justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, 'PPP') : <span>Pick start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate || undefined}
              onSelect={handleStartDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="end-date">End Date</Label>
        <Popover open={endOpen} onOpenChange={setEndOpen}>
          <PopoverTrigger asChild>
            <Button
              id="end-date"
              variant="outline"
              className={`w-[180px] justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, 'PPP') : <span>Pick end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate || undefined}
              onSelect={handleEndDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-end">
        <Button 
          variant="ghost" 
          onClick={handleClear}
          className="h-10"
        >
          Clear
        </Button>
      </div>
    </div>
  )
}

