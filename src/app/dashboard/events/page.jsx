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
import axios from 'axios' // Ensure axios is imported

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/pages/apis/events/allEventsTitles')
      console.log('API Response:', response.data); // Debugging
      const data = response.data
      if (data.status === 'success') {
        const flattenedEvents = data.data.flatMap(group => 
          group.events.map(event => ({
            ...event,
            category: group.type
          }))
        )
        setEvents(flattenedEvents)
      } else {
        throw new Error(data.message || 'Failed to fetch events')
      }
    } catch (err) {
      console.error('Error fetching events:', err.response ? err.response.data : err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (categoryFilter === '' || event.category === categoryFilter)
  )

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await axios.delete(`http://localhost:3000/pages/apis/events/deleteEventById/${id}`)
        if (response.status === 200) {
          setEvents(prev => prev.filter(event => event.id !== id))
          alert('Event deleted successfully')
        } else {
          throw new Error('Failed to delete event')
        }
      } catch (err) {
        console.error('Error deleting event:', err.response ? err.response.data : err.message)
        alert(err.message)
      }
    }
  }

  if (loading) return <div>Loading events...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

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
            <SelectItem value="H">Hajj</SelectItem>
            <SelectItem value="U">Umrah</SelectItem>
            <SelectItem value="T">Tour</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.id}</TableCell>
              <TableCell>{event.title}</TableCell>
              <TableCell>
                {event.category === 'H' ? 'Hajj' : 
                 event.category === 'U' ? 'Umrah' : 'Tour'}
              </TableCell>
              <TableCell>{event.month}</TableCell>
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
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
