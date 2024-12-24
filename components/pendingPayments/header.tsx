'use client'

import React from 'react'
import { ThemeToggle } from "../theme-toggle"
import { useMediaQuery } from 'react-responsive'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
interface HeaderProps {
  userName: string | undefined
}

export function Header({
  userName = "User",
}: HeaderProps) 
{
   const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  return (
    <div className="bg-blue-600 dark:bg-gray-900">
      <header className="bg-blue-600 dark:bg-gray-900 shadow-md text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">
              InvoicesGen
            </h1>
            
            {/* Theme Toggle */}
            {isMobile ? (
              <div className="fixed bottom-4 right-4 z-50">
                <ThemeToggle />
              </div>
            ) : (
              <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
              </div>
            )}
            
            <div className="flex items-center space-x-4 px-2">
                        <Avatar>
                          <AvatarImage src={`https://avatar.vercel.sh/${userName}.png`} alt={userName} />
                          <AvatarFallback className="dark:bg-gray-700">{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium dark:text-gray-200">{userName}</p>
                          {/* <p className="text-sm text-muted-foreground dark:text-gray-400">{businessDetails.name}</p> */}
                        </div>
                      </div>
          </div>
        </div>
      </header>
    </div>
  )
}