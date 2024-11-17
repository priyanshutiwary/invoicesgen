// "use client"

// import React, { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Edit, Trash2, Search } from "lucide-react"

// interface Item {
//   _id: string;
//   name: string;
//   price: number;
// }

// interface ItemManagementProps {
//   isItemOpen: boolean;
//   setIsItemOpen: (isOpen: boolean) => void;
//   isManageItemsOpen: boolean;
//   setIsManageItemsOpen: (isOpen: boolean) => void;
//   items: Item[] | undefined;
//   handleAddItem: (event: React.FormEvent<HTMLFormElement>) => void;
//   handleDeleteItem: (id: string) => void;
//   setEditingItem: (item: Item) => void;
//   setIsEditItemOpen: (isOpen: boolean) => void;
// }

// export function ItemManagement({ 
//   isItemOpen, 
//   setIsItemOpen, 
//   isManageItemsOpen, 
//   setIsManageItemsOpen, 
//   items, 
//   handleAddItem, 
//   handleDeleteItem, 
//   setEditingItem, 
//   setIsEditItemOpen 
// }: ItemManagementProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredItems, setFilteredItems] = useState<Item[] | undefined>(items);
  
  

//   useEffect(() => {
//     const filtered = items?.filter(item => 
//       item&&
//       (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.price.toString().includes(searchQuery.toLowerCase()))
//     );
//     setFilteredItems(filtered);
//   }, [searchQuery, items]);

//   return (
//     <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-blue-800">Manage Items</CardTitle>
//         <CardDescription className="text-blue-600">Add, edit, or remove item information</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <Dialog open={isItemOpen} onOpenChange={setIsItemOpen}>
//           <DialogTrigger asChild>
//             <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Add Item</Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Add New Item</DialogTitle>
//               <DialogDescription>
//                 Enter the details of your new item
//               </DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleAddItem} className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="itemName" className="text-right">
//                   Name
//                 </Label>
//                 <Input id="itemName" name="itemName" className="col-span-3" />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="itemDescription" className="text-right">
//                   Description
//                 </Label>
//                 <Input id="itemDescription" name="itemDescription" className="col-span-3" />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="itemPrice" className="text-right">
//                   Price
//                 </Label>
//                 <Input id="itemPrice" name="itemPrice" type="number" className="col-span-3" />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="itemTax" className="text-right">
//                   Tax (%)
//                 </Label>
//                 <Input id="itemTax" name="itemTax" type="number" className="col-span-3" />
//               </div>
//               <Button type="submit">Add Item</Button>
//             </form>
//           </DialogContent>
//         </Dialog>
//         <Dialog open={isManageItemsOpen} onOpenChange={setIsManageItemsOpen}>
//           <DialogTrigger asChild>
//             <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">Manage Items</Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[600px]">
//             <DialogHeader>
//               <DialogTitle>Manage Items</DialogTitle>
//               <DialogDescription>
//                 View, edit, or delete your items
//               </DialogDescription>
//             </DialogHeader>
//             <div className="flex items-center space-x-2 mb-4">
//               <Search className="w-4 h-4 text-gray-500" />
//               <Input
//                 placeholder="Search items..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="flex-grow"
//               />
//             </div>
//             <ScrollArea className="h-[400px] w-full rounded-md border p-4">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Price</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredItems && filteredItems.length > 0 ? (
//                     filteredItems.map((item) => (
//                       <TableRow key={item._id}>
//                         <TableCell>{item.name}</TableCell>
//                         <TableCell>₹{item.price.toFixed(2)}</TableCell>
//                         <TableCell>
//                           <div className="flex space-x-2">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => { setEditingItem(item); setIsEditItemOpen(true); }}
//                               className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => handleDeleteItem(item._id)}
//                               className="text-red-600 hover:text-red-800 hover:bg-red-100"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={3} className="text-center">No items found</TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </ScrollArea>
//           </DialogContent>
//         </Dialog>
//       </CardContent>
//     </Card>
//   )
// }

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
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg">
        <CardHeader className="border-b border-blue-100 pb-4 bg-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-[#1E3A8A]">Manage Items</CardTitle>
          <CardDescription className="text-[#3B82F6]">Add, edit, or remove item information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <Dialog open={isItemOpen} onOpenChange={setIsItemOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold">
                  Add Item
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-[#1E3A8A]">Add New Item</DialogTitle>
                <DialogDescription className="text-[#3B82F6]">
                  Enter the details of your new item
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="itemName" className="text-right text-[#1E3A8A]">
                    Name
                  </Label>
                  <Input id="itemName" name="itemName" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="itemDescription" className="text-right text-[#1E3A8A]">
                    Description
                  </Label>
                  <Input id="itemDescription" name="itemDescription" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="itemPrice" className="text-right text-[#1E3A8A]">
                    Price
                  </Label>
                  <Input id="itemPrice" name="itemPrice" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="itemTax" className="text-right text-[#1E3A8A]">
                    Tax (%)
                  </Label>
                  <Input id="itemTax" name="itemTax" type="number" className="col-span-3" />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full bg-[#3B82F6] hover:bg-[#2563EB]">Add Item</Button>
                </motion.div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isManageItemsOpen} onOpenChange={setIsManageItemsOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="w-full border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50">
                  Manage Items
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-[#1E3A8A]">Manage Items</DialogTitle>
                <DialogDescription className="text-[#3B82F6]">
                  View, edit, or delete your items
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 mb-4 bg-white rounded-md p-2 shadow-sm border border-blue-100">
                <Search className="w-4 h-4 text-[#3B82F6]" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow border-none focus:ring-0 focus:outline-none"
                />
              </div>
              <ScrollArea className="h-[400px] w-full rounded-md border border-blue-100 p-4 bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#EFF6FF]">
                      <TableHead className="font-bold text-[#1E3A8A]">Name</TableHead>
                      <TableHead className="font-bold text-[#1E3A8A]">Price</TableHead>
                      <TableHead className="font-bold text-[#1E3A8A]">Actions</TableHead>
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
                          className="hover:bg-blue-50"
                        >
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>₹{item.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => { setEditingItem(item); setIsEditItemOpen(true); }}
                                  className="text-[#3B82F6] hover:text-[#2563EB] hover:bg-blue-50"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item._id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
                        <TableCell colSpan={3} className="text-center text-gray-500">No items found</TableCell>
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