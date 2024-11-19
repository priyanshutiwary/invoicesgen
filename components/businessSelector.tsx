

import { SelectGroup,Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Business {
  _id: string;
  name: string;
}

interface BusinessSelectorProps {
  businesses: Business[];
  selectedBusinessId: string;
  onBusinessChange: (businessId: string) => void;
}

export default function BusinessSelector({ businesses, selectedBusinessId, onBusinessChange }: BusinessSelectorProps) {
  return (
    
    <Select onValueChange={onBusinessChange} value={selectedBusinessId}>
      
      <SelectTrigger className="w-[200px] bg-blue-100 dark:bg-blue-950">
        <SelectValue placeholder="Select a business" />
      </SelectTrigger>
      <SelectContent>
        {businesses.map((business) => (
          <SelectItem 
            key={business._id} 
            value={business._id}
          >
            {business.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}