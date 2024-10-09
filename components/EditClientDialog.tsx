import React from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function EditClientDialog({ isEditClientOpen, setIsEditClientOpen, editingClient, handleEditClient }) {
  return (
    <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>
            Update the details of your client
          </DialogDescription>
        </DialogHeader>
        {editingClient && (
          <form onSubmit={handleEditClient} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientName" className="text-right">
                Name
              </Label>
              <Input id="clientName" name="clientName" defaultValue={editingClient.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientEmail" className="text-right">
                Email
              </Label>
              <Input id="clientEmail" name="clientEmail" type="email" defaultValue={editingClient.email} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientPhone" className="text-right">
                Phone
              </Label>
              <Input id="clientPhone" name="clientPhone" type="tel" defaultValue={editingClient.phone} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientGstNumber" className="text-right">
                GST Number
              </Label>
              <Input id="clientGstNumber" name="clientGstNumber" defaultValue={editingClient.gstNumber} className="col-span-3" />
            </div>
            <Button type="submit">Update Client</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}