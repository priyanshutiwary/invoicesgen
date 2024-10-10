import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Trash2 } from "lucide-react"

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Manage Clients</CardTitle>
        <CardDescription>Add or edit client information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isClientOpen} onOpenChange={setIsClientOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Add Client</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the details of your new client
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddClient} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientName" className="text-right">
                  Name
                </Label>
                <Input id="clientName" name="clientName" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientEmail" className="text-right">
                  Email
                </Label>
                <Input id="clientEmail" name="clientEmail" type="email" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientPhone" className="text-right">
                  Phone
                </Label>
                <Input id="clientPhone" name="clientPhone" type="tel" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clientGstNumber" className="text-right">
                  GST Number
                </Label>
                <Input id="clientGstNumber" name="clientGstNumber" className="col-span-3" />
              </div>
              <Button type="submit">Add Client</Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={isManageClientsOpen} onOpenChange={setIsManageClientsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">Manage Clients</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Manage Clients</DialogTitle>
              <DialogDescription>
                View, edit, or delete your clients
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => { setEditingClient(client); setIsEditClientOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteClient(client.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}