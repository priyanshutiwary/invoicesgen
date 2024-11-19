import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IndianRupee } from "lucide-react"

export function DashboardCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="bg-white dark:bg-gray-900">
          <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-gray-100">
            Total Pending Payments
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Amount you need to pay
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            <IndianRupee className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 dark:text-yellow-400" />
            <span className="font-mono">5,000.00</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="bg-white dark:bg-gray-900">
          <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-gray-100">
            Payments to Receive
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Amount owed to you
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            <IndianRupee className="h-5 w-5 md:h-6 md:w-6 text-green-500 dark:text-green-400" />
            <span className="font-mono">12,500.00</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}