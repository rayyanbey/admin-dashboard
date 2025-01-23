"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, X } from "lucide-react"

export default function CreateEventPage() {
  const [event, setEvent] = useState({
    title: "",
    images: [],
    imageFiles: [],
    description: "",
    type: "",
    countryName: "",
    posters: [],
    posterFiles: [],
    duration: "",
    pricing: {},
    visa: "",
    descriptionTitle: "",
    importantNote: "",
    month: "",
    eventDetails: {
      hotels: [],
    },
    flights: [],
  })

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

  const handleHotelChange = (index, field, value) => {
    setEvent((prev) => {
      const newHotels = [...prev.eventDetails.hotels]
      newHotels[index] = { ...newHotels[index], [field]: value }
      return { ...prev, eventDetails: { ...prev.eventDetails, hotels: newHotels } }
    })
  }

  const handleHotelImageUpload = (index, e) => {
    const files = Array.from(e.target.files)
    setEvent((prev) => {
      const newHotels = [...prev.eventDetails.hotels]
      newHotels[index] = {
        ...newHotels[index],
        imageFiles: [...(newHotels[index].imageFiles || []), ...files],
        images: [...(newHotels[index].images || []), ...files.map((file) => URL.createObjectURL(file))],
      }
      return { ...prev, eventDetails: { ...prev.eventDetails, hotels: newHotels } }
    })
  }

  const handleFlightChange = (index, field, value) => {
    setEvent((prev) => {
      const newFlights = [...prev.flights]
      newFlights[index] = { ...newFlights[index], [field]: value }
      return { ...prev, flights: newFlights }
    })
  }

  const addHotel = () => {
    setEvent((prev) => ({
      ...prev,
      eventDetails: {
        ...prev.eventDetails,
        hotels: [...prev.eventDetails.hotels, { name: "", location: "", description: "", images: [], imageFiles: [] }],
      },
    }))
  }

  const removeHotel = (index) => {
    setEvent((prev) => ({
      ...prev,
      eventDetails: {
        ...prev.eventDetails,
        hotels: prev.eventDetails.hotels.filter((_, i) => i !== index),
      },
    }))
  }

  const addFlight = () => {
    setEvent((prev) => ({
      ...prev,
      flights: [...prev.flights, { departureCity: "", destinationCity: "", departureDate: "", returnDate: "" }],
    }))
  }

  const removeFlight = (index) => {
    setEvent((prev) => ({
      ...prev,
      flights: prev.flights.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()

    // Append event data
    Object.keys(event).forEach((key) => {
      if (key !== "imageFiles" && key !== "posterFiles" && key !== "eventDetails" && key !== "flights") {
        formData.append(key, JSON.stringify(event[key]))
      }
    })

    // Append image files
    event.imageFiles.forEach((file, index) => {
      formData.append(`image-${index}`, file)
    })

    // Append poster files
    event.posterFiles.forEach((file, index) => {
      formData.append(`poster-${index}`, file)
    })

    // Append hotel data and files
    event.eventDetails.hotels.forEach((hotel, hotelIndex) => {
      formData.append(`hotel-${hotelIndex}`, JSON.stringify(hotel))
      hotel.imageFiles.forEach((file, fileIndex) => {
        formData.append(`hotel-${hotelIndex}-image-${fileIndex}`, file)
      })
    })

    // Append flight data
    formData.append("flights", JSON.stringify(event.flights))

    // Here you would typically send the formData to your backend
    console.log("Form data to be sent:", formData)
  }

  return (
    <div className="flex flex-col space-y-6 w-full">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="event" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="event">Event Details</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
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
            </Card>
          </TabsContent>
          <TabsContent value="hotels">
            <Card>
              <CardHeader>
                <CardTitle>Hotel Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.eventDetails.hotels.map((hotel, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">Hotel {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`hotelName-${index}`}>Hotel Name</Label>
                        <Input
                          id={`hotelName-${index}`}
                          value={hotel.name}
                          onChange={(e) => handleHotelChange(index, "name", e.target.value)}
                          required
                          minLength={3}
                          maxLength={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`hotelLocation-${index}`}>Location</Label>
                        <Input
                          id={`hotelLocation-${index}`}
                          value={hotel.location}
                          onChange={(e) => handleHotelChange(index, "location", e.target.value)}
                          required
                          minLength={3}
                          maxLength={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`hotelDescription-${index}`}>Description</Label>
                        <Textarea
                          id={`hotelDescription-${index}`}
                          value={hotel.description}
                          onChange={(e) => handleHotelChange(index, "description", e.target.value)}
                          required
                          minLength={10}
                          maxLength={1000}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`hotelImages-${index}`}>Images (upload from device)</Label>
                        <div className="flex flex-col space-y-2">
                          <Input
                            id={`hotelImages-${index}`}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleHotelImageUpload(index, e)}
                          />
                          <p className="text-sm text-gray-500">{hotel.images.length} image(s) selected</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="button" variant="destructive" onClick={() => removeHotel(index)}>
                        Remove Hotel
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                <Button type="button" onClick={addHotel} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Hotel
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="flights">
            <Card>
              <CardHeader>
                <CardTitle>Flight Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.flights.map((flight, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">Flight {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`departureCity-${index}`}>Departure City</Label>
                          <Input
                            id={`departureCity-${index}`}
                            value={flight.departureCity}
                            onChange={(e) => handleFlightChange(index, "departureCity", e.target.value)}
                            required
                            minLength={2}
                            maxLength={100}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`destinationCity-${index}`}>Destination City</Label>
                          <Input
                            id={`destinationCity-${index}`}
                            value={flight.destinationCity}
                            onChange={(e) => handleFlightChange(index, "destinationCity", e.target.value)}
                            required
                            minLength={2}
                            maxLength={100}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`departureDate-${index}`}>Departure Date</Label>
                          <Input
                            id={`departureDate-${index}`}
                            type="date"
                            value={flight.departureDate}
                            onChange={(e) => handleFlightChange(index, "departureDate", e.target.value)}
                            required
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`returnDate-${index}`}>Return Date</Label>
                          <Input
                            id={`returnDate-${index}`}
                            type="date"
                            value={flight.returnDate}
                            onChange={(e) => handleFlightChange(index, "returnDate", e.target.value)}
                            required
                            min={flight.departureDate}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="button" variant="destructive" onClick={() => removeFlight(index)}>
                        Remove Flight
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                <Button type="button" onClick={addFlight} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Flight
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Button type="submit" className="w-full">
          Create Event
        </Button>
      </form>
    </div>
  )
}

