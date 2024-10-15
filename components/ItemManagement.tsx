import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Trash2 } from "lucide-react"

interface Item {
  id: string;
  name: string;
  price: number;
}

interface ItemManagementProps {
  isItemOpen: boolean;
  setIsItemOpen: (isOpen: boolean) => void;
  isManageItemsOpen: boolean;
  setIsManageItemsOpen: (isOpen: boolean) => void;
  items: Item[] | undefined;
  handleAddItem: (event: React.FormEvent<HTMLFormElement>) => void;
  handleDeleteItem: (id: string) => void;
  setEditingItem: (item: Item) => void;
  setIsEditItemOpen: (isOpen: boolean) => void;
}

export function ItemManagement({ 
  isItemOpen, 
  setIsItemOpen, 
  isManageItemsOpen, 
  setIsManageItemsOpen, 
  items, 
  handleAddItem, 
  handleDeleteItem, 
  setEditingItem, 
  setIsEditItemOpen 
}: ItemManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Manage Items</CardTitle>
        <CardDescription>Add or edit item information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isItemOpen} onOpenChange={setIsItemOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Add Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Enter the details of your new item
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemName" className="text-right">
                  Name
                </Label>
                <Input id="itemName" name="itemName" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemDescription" className="text-right">
                  Description
                </Label>
                <Input id="itemDescription" name="itemDescription" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemPrice" className="text-right">
                  Price
                </Label>
                <Input id="itemPrice" name="itemPrice" type="number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemTax" className="text-right">
                  Tax (%)
                </Label>
                <Input id="itemTax" name="itemTax" type="number" className="col-span-3" />
              </div>
              <Button type="submit">Add Item</Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={isManageItemsOpen} onOpenChange={setIsManageItemsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">Manage Items</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Manage Items</DialogTitle>
              <DialogDescription>
                View, edit, or delete your items
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items && items.length > 0 ? (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>₹{item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => { setEditingItem(item); setIsEditItemOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">No items available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}