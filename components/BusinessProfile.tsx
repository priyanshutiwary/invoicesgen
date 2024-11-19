
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useSession } from 'next-auth/react'
interface BusinessDetails {
  userId: string;
  name: string;
  contact: string;
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
  handleDeleteBusiness: () => void;
}

export function BusinessProfile({ 
  isProfileOpen, 
  setIsProfileOpen, 
  businessDetails, 
  handleBusinessDetailsChange, 
  handleSaveBusinessDetails,
  handleDeleteBusiness
}: BusinessProfileProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [localBusinessDetails, setLocalBusinessDetails] = useState(businessDetails);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    setLocalBusinessDetails(businessDetails);
  }, [businessDetails]);

  const handleLocalChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalBusinessDetails(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSaveBusinessDetails();
    setIsEditing(false);
  }, [handleSaveBusinessDetails]);

  const handleDeleteClick = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmation === `delete/${localBusinessDetails.name}`) {
      console.log(businessDetails);
      
      handleDeleteBusiness();
      setIsDeleteDialogOpen(false);
    }
  }, [deleteConfirmation, localBusinessDetails.name, handleDeleteBusiness]);

  return (
    <>
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#4285F4]">Business Details</DialogTitle>
            <DialogDescription className="text-[#6B7280] dark:text-gray-400">
              View and edit your business information
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2937] dark:text-white">{localBusinessDetails.name}</h3>
                    <p className="text-[#6B7280] dark:text-gray-400 text-sm">Business name cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#1F2937] dark:text-gray-200">Contact</Label>
                    <Input id="email" name="email" value={localBusinessDetails.contact} onChange={handleLocalChange} className="mt-1 border-[#E5E7EB] dark:border-gray-700 dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-[#1F2937] dark:text-gray-200">Address</Label>
                    <Input id="address" name="address" value={localBusinessDetails.address} onChange={handleLocalChange} className="mt-1 border-[#E5E7EB] dark:border-gray-700 dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-[#1F2937] dark:text-gray-200">Description</Label>
                    <Textarea id="description" name="description" value={localBusinessDetails.description} onChange={handleLocalChange} className="mt-1 border-[#E5E7EB] dark:border-gray-700 dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <Label htmlFor="gstNumber" className="text-[#1F2937] dark:text-gray-200">GST Number</Label>
                    <Input id="gstNumber" name="gstNumber" value={localBusinessDetails.gstNumber} onChange={handleLocalChange} className="mt-1 border-[#E5E7EB] dark:border-gray-700 dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Button type="submit" className="bg-[#4285F4] text-white hover:bg-[#4285F4]/90">Save Changes</Button>
                    <span 
                      onClick={handleDeleteClick}
                      className="text-red-600 dark:text-red-400 cursor-pointer hover:underline"
                    >
                      Delete Business
                    </span>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-2 text-[#1F2937] dark:text-gray-200">
                  <p><strong>Name:</strong> {localBusinessDetails.name}</p>
                  <p><strong>Contact:</strong> {localBusinessDetails.email}</p>
                  <p><strong>Address:</strong> {localBusinessDetails.address}</p>
                  <p><strong>Description:</strong> {localBusinessDetails.description}</p>
                  <p><strong>GST Number:</strong> {localBusinessDetails.gstNumber}</p>
                </div>
                <Button onClick={() => setIsEditing(true)} className="mt-4 bg-[#4285F4] text-white hover:bg-[#4285F4]/90">
                  <Edit className="mr-2 h-4 w-4" /> Edit Details
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              This action cannot be undone. This will permanently delete your business account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Label htmlFor="deleteConfirmation" className="text-sm font-medium dark:text-gray-200">
              Type "delete/{localBusinessDetails.name}" to confirm:
            </Label>
            <Input
              id="deleteConfirmation"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="mt-1 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" onClick={()=>{setDeleteConfirmation("")}}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteConfirmation !== `delete/${localBusinessDetails.name}`}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800"
            >
              Delete Business
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}