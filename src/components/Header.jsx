'use client'

import { useState } from 'react'
import { Bell, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <span className="text-xl font-semibold">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Button size="icon" variant="ghost">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              <Input
                type="search"
                placeholder="Search..."
                className="w-64"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

