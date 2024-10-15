import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BusinessDetails } from '@/backend/types/type'

interface CreateBusinessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  businessDetails: BusinessDetails;
  handleBusinessDetailsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveBusinessDetails: () => void;
  user_id: string | undefined;
  isLoading: boolean;
}

export function CreateBusinessPopup({
  isOpen,
  onClose,
  businessDetails,
  handleBusinessDetailsChange,
  handleSaveBusinessDetails,
  user_id,
  isLoading
}: CreateBusinessPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Business</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); handleSaveBusinessDetails(); }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Business Name</Label>
              <Input id="name" name="name" value={businessDetails.name} onChange={handleBusinessDetailsChange} />
            </div>
            <div>
              <Label htmlFor="email">Contact</Label>
              <Input id="email" name="email" value={businessDetails.email} onChange={handleBusinessDetailsChange} />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={businessDetails.address} onChange={handleBusinessDetailsChange} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={businessDetails.description} onChange={handleBusinessDetailsChange} />
            </div>
            <div>
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input id="gstNumber" name="gstNumber" value={businessDetails.gstNumber} onChange={handleBusinessDetailsChange} />
            </div>
            <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Business'}
            </Button>          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}