'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, MessageSquare, Settings, Building } from 'lucide-react'

const sidebarItems = [
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Reviews', href: '/dashboard/reviews', icon: MessageSquare },
  { name: 'Services', href: '/dashboard/services', icon: Settings },
  { name: 'Company Info', href: '/dashboard/company', icon: Building },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        {sidebarItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
              pathname.startsWith(item.href)
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

