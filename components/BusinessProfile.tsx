import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useSession } from 'next-auth/react'
interface BusinessDetails {
  userId: string;
  name: string;
  email: string;
  address: string;
  description: string;
  gstNumber: string;
}

interface BusinessProfileProps {
  isProfileOpen: boolean;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  businessDetails: BusinessDetails;
  handleBusinessDetailsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveBusinessDetails: () => void;
}

export function BusinessProfile({ 
  isProfileOpen, 
  setIsProfileOpen, 
  businessDetails, 
  handleBusinessDetailsChange, 
  handleSaveBusinessDetails 
}: BusinessProfileProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false)
  businessDetails.userId=session?.user?._id
  

  return (
    <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Business Details</DialogTitle>
          <DialogDescription>
            Selected business information
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isEditing ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSaveBusinessDetails(); setIsEditing(false); }}>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{businessDetails.name}</h3>
                  <p className="text-gray-500 text-sm">Business name cannot be changed</p>                </div>
                <div>
                  <Label htmlFor="email">Contact</Label>
                  <Input id="email" name="email"  value={businessDetails.contact} onChange={handleBusinessDetailsChange} />
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
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-2">
                <p><strong>Name:</strong> {businessDetails.name}</p>
                <p><strong>Contact:</strong> {businessDetails.contact}</p>
                <p><strong>Address:</strong> {businessDetails.address}</p>
                <p><strong>Description:</strong> {businessDetails.description}</p>
                <p><strong>GST Number:</strong> {businessDetails.gstNumber}</p>
              </div>
              <Button onClick={() => setIsEditing(true)} className="mt-4">
                <Edit className="mr-2 h-4 w-4" /> Edit Details
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}