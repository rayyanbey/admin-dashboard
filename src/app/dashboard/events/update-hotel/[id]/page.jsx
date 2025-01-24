"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// This is a dummy function to simulate fetching hotel data
const fetchHotelData = async (id) => {
  // In a real application, you would fetch this data from an API
  return {
    id: id,
    name: "Sample Hotel",
    location: "Sample Location",
    description: "This is a sample hotel description",
    images: ["https://example.com/hotel1.jpg", "https://example.com/hotel2.jpg"],
    imageFiles: [],
  }
}

export default function UpdateHotelPage() {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)

  useEffect(() => {
    const loadHotelData = async () => {
      const data = await fetchHotelData(id)
      setHotel(data)
    }
    loadHotelData()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setHotel((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setHotel((prev) => ({
      ...prev,
      imageFiles: [...(prev.imageFiles || []), ...files],
      images: [...(prev.images || []), ...files.map((file) => URL.createObjectURL(file))],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the updated hotel data to your backend
    console.log("Updated hotel data:", hotel)
  }

  if (!hotel) return <div>Loading...</div>

  return (
    <div className="flex flex-col space-y-6 w-full">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Update Hotel: {hotel.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="hotel" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="hotel">Hotel Details</TabsTrigger>
          </TabsList>
          <TabsContent value="hotel">
            <Card>
              <CardHeader>
                <CardTitle>Hotel Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hotel Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={hotel.name}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={hotel.location}
                    onChange={handleChange}
                    required
                    minLength={3}
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={hotel.description}
                    onChange={handleChange}
                    required
                    minLength={10}
                    maxLength={1000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="images">Images (upload from device)</Label>
                  <div className="flex flex-col space-y-2">
                    <Input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} />
                    <p className="text-sm text-gray-500">{hotel.images.length} image(s) selected</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Update Hotel
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}

