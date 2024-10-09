import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee } from "lucide-react"

export function DashboardCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Total Pending Payments</CardTitle>
          <CardDescription>Amount you need to pay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-xl md:text-2xl font-bold">
            <IndianRupee  className="h-5 w-5 md:h-6 md:w-6 text-yellow-500" />
            <span>5,000.00</span>
          </div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Payments to Receive</CardTitle>
          <CardDescription>Amount owed to you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-xl md:text-2xl font-bold">
            <IndianRupee className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
            <span>12,500.00</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}