import React from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function EditItemDialog({ isEditItemOpen, setIsEditItemOpen, editingItem, handleEditItem }) {
  return (
    <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update the details of your item
          </DialogDescription>
        </DialogHeader>
        {editingItem && (
          <form onSubmit={handleEditItem} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemName" className="text-right">
                Name
              </Label>
              <Input id="itemName" name="itemName" defaultValue={editingItem.name} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemDescription" className="text-right">
                Description
              </Label>
              <Input id="itemDescription" name="itemDescription" defaultValue={editingItem.description} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemPrice" className="text-right">
                Price
              </Label>
              <Input id="itemPrice" name="itemPrice" type="number" defaultValue={editingItem.price} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemTax" className="text-right">
                Tax (%)
              </Label>
              <Input id="itemTax" name="itemTax" type="number" defaultValue={editingItem.tax} className="col-span-3" />
            </div>
            <Button type="submit">Update Item</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}