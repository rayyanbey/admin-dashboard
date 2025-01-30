"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UpdateEventPage() {
  const { id } = useParams()
  const router = useRouter()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/pages/apis/events/getDetails?id=${id}`)
        if (!response.ok) throw new Error("Failed to fetch event details")
        const data = await response.json()
        setEvent(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEventData()
  }, [id])

  const handleChange = (e, name = null) => {
    if (name) {
      setEvent((prev) => ({ ...prev, [name]: e }))
    } else {
      const { name, value } = e.target
      setEvent((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = (e, field) => {
    const files = Array.from(e.target.files)
    setEvent((prev) => ({
      ...prev,
      [`${field}Files`]: [...(prev[`${field}Files`] || []), ...files],
      [field]: [...(prev[field] || []), ...files.map((file) => URL.createObjectURL(file))],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", event.title)
      formData.append("description", event.description)
      formData.append("type", event.type)
      formData.append("duration", event.duration)
      formData.append("pricing", JSON.stringify(event.pricing))
      formData.append("visa", event.visa)
      formData.append("descriptionTitle", event.descriptionTitle)
      formData.append("importantNote", event.importantNote)
      formData.append("month", event.month)

      if (event.type === "T") {
        formData.append("countryName", event.countryName)
      }

      // Append image files
      if (event.imageFiles.length > 0) {
        event.imageFiles.forEach((file) => formData.append("images", file))
      }

      // Append poster files
      if (event.posterFiles.length > 0) {
        event.posterFiles.forEach((file) => formData.append("poster", file))
      }

      // Append event details
      formData.append("eventDetails", JSON.stringify(event.eventDetails || {}))

      const response = await fetch("http://localhost:3000/pages/apis/events/updateEvent", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (response.ok) {
        alert("Event updated successfully!")
        router.push("/events") // Redirect to events page after update
      } else {
        throw new Error(result.message)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

  return (
    <div className="flex flex-col space-y-6 w-full">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Update Event: {event.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="event" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="event">Event Details</TabsTrigger>
          </TabsList>
          <TabsContent value="event">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={event.title} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Images</Label>
                  <Input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, "imageFiles")} />
                  <p>{event.images?.length || 0} image(s) selected</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" value={event.description} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" value={event.type} onValueChange={(value) => handleChange(value, "type")}>
                    <SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="H">H</SelectItem>
                      <SelectItem value="U">U</SelectItem>
                      <SelectItem value="T">T</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {event.type === "T" && (
                  <div className="space-y-2">
                    <Label htmlFor="countryName">Country Name</Label>
                    <Input id="countryName" name="countryName" value={event.countryName} onChange={handleChange} required />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="pricing">Pricing</Label>
                  <Textarea id="pricing" name="pricing" value={JSON.stringify(event.pricing, null, 2)} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visa">Visa</Label>
                  <Select name="visa" value={event.visa} onValueChange={(value) => handleChange(value, "visa")}>
                    <SelectTrigger><SelectValue placeholder="Select visa type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Yes</SelectItem>
                      <SelectItem value="N">No</SelectItem>
                      <SelectItem value="Fee">Fee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Updating..." : "Update Event"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
