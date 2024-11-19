
"use client"

import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Trash2, Search } from "lucide-react"

interface Item {
  _id: string;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[] | undefined>(items);

  useEffect(() => {
    const filtered = items?.filter(item => 
      item &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.price.toString().includes(searchQuery.toLowerCase()))
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 shadow-lg">
        <CardHeader className="border-b border-blue-100 dark:border-gray-700 pb-4 bg-white dark:bg-gray-900 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-[#1E3A8A] dark:text-blue-400">Manage Items</CardTitle>
          <CardDescription className="text-[#3B82F6] dark:text-blue-300">Add, edit, or remove item information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6 dark:bg-gray-900">
          <Dialog open={isItemOpen} onOpenChange={setIsItemOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-[#3B82F6] dark:bg-blue-600 hover:bg-[#2563EB] dark:hover:bg-blue-700 text-white font-semibold">
                  Add Item
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="text-[#1E3A8A] dark:text-blue-400">Add New Item</DialogTitle>
                <DialogDescription className="text-[#3B82F6] dark:text-blue-300">
                  Enter the details of your new item
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="itemName" className="text-right text-[#1E3A8A] dark:text-blue-400">
                    Name
                  </Label>
                  <Input id="itemName" name="itemName" className="col-span-3 dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="itemDescription" className="text-right text-[#1E3A8A] dark:text-blue-400">
                    Description
                  </Label>
                  <Input id="itemDescription" name="itemDescription" className="col-span-3 dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="itemPrice" className="text-right text-[#1E3A8A] dark:text-blue-400">
                    Price
                  </Label>
                  <Input id="itemPrice" name="itemPrice" type="number" className="col-span-3 dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="itemTax" className="text-right text-[#1E3A8A] dark:text-blue-400">
                    Tax (%)
                  </Label>
                  <Input id="itemTax" name="itemTax" type="number" className="col-span-3 dark:bg-gray-800 dark:border-gray-700" />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full bg-[#3B82F6] dark:bg-blue-600 hover:bg-[#2563EB] dark:hover:bg-blue-700">Add Item</Button>
                </motion.div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isManageItemsOpen} onOpenChange={setIsManageItemsOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="w-full border-[#3B82F6] dark:border-blue-500 text-[#3B82F6] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800">
                  Manage Items
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="text-[#1E3A8A] dark:text-blue-400">Manage Items</DialogTitle>
                <DialogDescription className="text-[#3B82F6] dark:text-blue-300">
                  View, edit, or delete your items
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 mb-4 bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm border border-blue-100 dark:border-gray-700">
                <Search className="w-4 h-4 text-[#3B82F6] dark:text-blue-400" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow border-none focus:ring-0 focus:outline-none dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border border-blue-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#EFF6FF] dark:bg-gray-800">
                      <TableHead className="font-bold text-[#1E3A8A] dark:text-blue-400">Name</TableHead>
                      <TableHead className="font-bold text-[#1E3A8A] dark:text-blue-400">Price</TableHead>
                      <TableHead className="font-bold text-[#1E3A8A] dark:text-blue-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems && filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <motion.tr
                          key={item._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-blue-50 dark:hover:bg-gray-700"
                        >
                          <TableCell className="font-medium dark:text-gray-200">{item.name}</TableCell>
                          <TableCell className="dark:text-gray-300">₹{item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => { setEditingItem(item); setIsEditItemOpen(true); }}
                                  className="text-[#3B82F6] dark:text-blue-400 hover:text-[#2563EB] dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item._id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500 dark:text-gray-400">No items found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  )
}