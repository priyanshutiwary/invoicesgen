

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

interface Client {
  _id: number;
  name: string;
  contact: string;
  gstNumber: string;
}

interface ClientManagementProps {
  isClientOpen: boolean;
  setIsClientOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isManageClientsOpen: boolean;
  setIsManageClientsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clients: Client[];
  handleAddClient: (e: React.FormEvent<HTMLFormElement>) => void;
  handleDeleteClient: (id: number) => void;
  setEditingClient: React.Dispatch<React.SetStateAction<Client | null>>;
  setIsEditClientOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ClientManagement({ 
  isClientOpen, 
  setIsClientOpen, 
  isManageClientsOpen, 
  setIsManageClientsOpen, 
  clients, 
  handleAddClient, 
  handleDeleteClient, 
  setEditingClient, 
  setIsEditClientOpen 
}: ClientManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);

  useEffect(() => {
    const filtered = clients.filter(client => 
      client &&
      (client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       client.contact?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (client.gstNumber?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()))
    );
    setFilteredClients(filtered);
  }, [clients, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 shadow-lg">
        <CardHeader className="border-b border-blue-100 dark:border-gray-700 pb-4 bg-white dark:bg-gray-900 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-[#1E3A8A] dark:text-blue-400">Manage Clients</CardTitle>
          <CardDescription className="text-[#3B82F6] dark:text-blue-300">Add, edit, or remove client information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6 dark:bg-gray-900">
          <Dialog open={isClientOpen} onOpenChange={setIsClientOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-[#3B82F6] dark:bg-blue-600 hover:bg-[#2563EB] dark:hover:bg-blue-700 text-white font-semibold">
                  Add Client
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="text-[#1E3A8A] dark:text-blue-400">Add New Client</DialogTitle>
                <DialogDescription className="text-[#3B82F6] dark:text-blue-300">
                  Enter the details of your new client
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddClient} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="clientName" className="text-right text-[#1E3A8A]">
                    Name
                  </Label>
                  <Input id="clientName" name="clientName" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="clientEmail" className="text-right text-[#1E3A8A]">
                    Contact
                  </Label>
                  <Input id="clientEmail" name="clientEmail" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="clientGstNumber" className="text-right text-[#1E3A8A]">
                    GST Number
                  </Label>
                  <Input id="clientGstNumber" name="clientGstNumber" className="col-span-3" />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full bg-[#3B82F6] hover:bg-[#2563EB]">Add Client</Button>
                </motion.div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isManageClientsOpen} onOpenChange={setIsManageClientsOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="w-full border-[#3B82F6] dark:border-blue-500 text-[#3B82F6] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800">
                  Manage Clients
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="text-[#1E3A8A] dark:text-blue-400">Manage Clients</DialogTitle>
                <DialogDescription className="text-[#3B82F6] dark:text-blue-300">
                  View, edit, or delete your clients
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 mb-4 bg-white dark:bg-gray-800 rounded-md p-2 shadow-sm border border-blue-100 dark:border-gray-700">
                <Search className="w-4 h-4 text-[#3B82F6] dark:text-blue-400" />
                <Input
                  placeholder="Search clients..."
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
                      <TableHead className="font-bold text-[#1E3A8A] dark:text-blue-400">Contact</TableHead>
                      <TableHead className="font-bold text-[#1E3A8A] dark:text-blue-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients && filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <motion.tr
                          key={client._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-blue-50 dark:hover:bg-gray-700"
                        >
                          <TableCell className="font-medium dark:text-gray-200">{client.name}</TableCell>
                          <TableCell className="dark:text-gray-300">{client.contact}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingClient(client);
                                    setIsEditClientOpen(true);
                                  }}
                                  className="text-[#3B82F6] dark:text-blue-400 hover:text-[#2563EB] dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClient(client._id)}
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
                        <TableCell colSpan={3} className="text-center text-gray-500 dark:text-gray-400">No clients found</TableCell>
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