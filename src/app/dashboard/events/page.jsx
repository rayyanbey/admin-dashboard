'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


// Mock data
const events = [
  { id: 1, title: 'Summer Festival', category: 'H', date: '2023-07-15' },
  { id: 2, title: 'Tech Conference', category: 'U', date: '2023-08-22' },
  { id: 3, title: 'Food Fair', category: 'T', date: '2023-09-10' },
]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === '' || event.category === categoryFilter)
  )

  useEffect(() => {
    fetchEvents();
  }, [])
  
  const fetchEvents = async()=>{
    //api to get event data
  }
  
  const handleDelete = (id) => {
    if(alert("Are you Sure?")){
      //calling api to delete this event
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Event Management</h1>
        <Button asChild>
          <Link href="/dashboard/events/create">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Link>
        </Button>
      </div>
      <div className="flex space-x-2">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="H">H</SelectItem>
            <SelectItem value="U">U</SelectItem>
            <SelectItem value="T">T</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.id}</TableCell>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.category}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild className="mr-2">
                  <Link href={`/dashboard/events/update/${event.id}`}>Update Details</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="mr-2">
                  <Link href={`/dashboard/events/update-flight/${event.id}`}>Update Flight</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="mr-2">
                  <Link href={`/dashboard/events/update-hotel/${event.id}`}>Update Hotel</Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

