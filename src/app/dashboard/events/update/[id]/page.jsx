"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// This is a dummy function to simulate fetching event data
const fetchEventData = async (id) => {
  // In a real application, you would fetch this data from an API
  return {
    id: id,
    title: "Sample Event",
    images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    imageFiles: [],
    description: "This is a sample event description",
    type: "H",
    countryName: "Sample Country",
    posters: ["https://example.com/poster1.jpg"],
    posterFiles: [],
    duration: "3",
    pricing: { standard: 100, vip: 200 },
    visa: "Y",
    descriptionTitle: "Sample Description Title",
    importantNote: "This is an important note",
    month: "July",
  }
}

export default function UpdateEventPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)

  useEffect(() => {
    const loadEventData = async () => {
      const data = await fetchEventData(id)
      setEvent(data)
    }
    loadEventData()
  }, [id])

  const handleChange = (e, name = null) => {
    if (name) {
      // This is for the Select component
      setEvent((prev) => ({ ...prev, [name]: e }))
    } else {
      // This is for regular input fields
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the updated event data to your backend
    console.log("Updated event data:", event)
  }

  if (!event) return <div>Loading...</div>

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
                  <Label htmlFor="title">Title (Navigation title)</Label>
                  <Input
                    id="title"
                    name="title"
                    value={event.title}
                    onChange={handleChange}
                    required
                    minLength={5}
                    maxLength={150}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="images">Images (URLs or upload)</Label>
                  <div className="flex flex-col space-y-2">
                    <Input
                      id="images"
                      name="images"
                      value={event.images.filter((img) => !img.startsWith("blob:")).join(",")}
                      onChange={handleChange}
                      placeholder="Enter image URLs separated by commas"
                    />
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, "images")}
                    />
                    <p className="text-sm text-gray-500">{event.images.length} image(s) selected</p>
                  </div>
                  {event.images.length < 3 && (
                    <p className="text-sm text-red-500">At least three images are required.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={event.description}
                    onChange={handleChange}
                    required
                    minLength={20}
                    maxLength={2000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" value={event.type} onValueChange={(value) => handleChange(value, "type")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
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
                    <Input
                      id="countryName"
                      name="countryName"
                      value={event.countryName}
                      onChange={handleChange}
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </div>
                )}
                {event.type === "H" && (
                  <div className="space-y-2">
                    <Label htmlFor="posters">Posters (URLs or upload, at least 1 required)</Label>
                    <div className="flex flex-col space-y-2">
                      <Input
                        id="posters"
                        name="posters"
                        value={event.posters.filter((poster) => !poster.startsWith("blob:")).join(",")}
                        onChange={handleChange}
                        placeholder="Enter poster URLs separated by commas"
                      />
                      <Input
                        id="posterUpload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, "posters")}
                      />
                      <p className="text-sm text-gray-500">{event.posters.length} poster(s) selected</p>
                    </div>
                    {event.posters.length === 0 && (
                      <p className="text-sm text-red-500">At least one poster is required.</p>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (nights)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={event.duration}
                    onChange={handleChange}
                    required
                    min={1}
                    max={365}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricing">Pricing (JSON)</Label>
                  <Textarea
                    id="pricing"
                    name="pricing"
                    value={typeof event.pricing === "object" ? JSON.stringify(event.pricing, null, 2) : event.pricing}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value)
                        setEvent((prev) => ({ ...prev, pricing: parsed }))
                      } catch (error) {
                        setEvent((prev) => ({ ...prev, pricing: e.target.value }))
                      }
                    }}
                    required
                  />
                  {typeof event.pricing === "string" && (
                    <p className="text-sm text-yellow-500">
                      Warning: Current pricing is not valid JSON. Please correct it before submitting.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visa">Visa</Label>
                  <Select name="visa" value={event.visa} onValueChange={(value) => handleChange(value, "visa")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visa type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Y">Yes</SelectItem>
                      <SelectItem value="N">No</SelectItem>
                      <SelectItem value="Fee">Fee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionTitle">Description Title</Label>
                  <Input
                    id="descriptionTitle"
                    name="descriptionTitle"
                    value={event.descriptionTitle}
                    onChange={handleChange}
                    required
                    minLength={5}
                    maxLength={2000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="importantNote">Important Note</Label>
                  <Textarea
                    id="importantNote"
                    name="importantNote"
                    value={event.importantNote}
                    onChange={handleChange}
                    minLength={5}
                    maxLength={1000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Input
                    id="month"
                    name="month"
                    value={event.month}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={100}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Update Event
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}

