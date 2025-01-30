"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, X } from "lucide-react";

export default function CreateEventPage() {
  const [event, setEvent] = useState({
    title: "",
    images: [],
    imageFiles: [],
    description: "",
    type: "",
    countryName: "",
    poster: null,
    posterUrl: "",
    duration: "",
    pricing: {},
    visa: "",
    descriptionTitle: "",
    importantNote: "",
    month: "",
    eventDetails: {
      hotels: [],
      exclusion: {},
      inclusion: {},
      transportation: {},
    },
    flights: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e, name = null) => {
    if (name) {
      // This is for the Select component
      setEvent((prev) => ({ ...prev, [name]: e }));
    } else {
      // This is for regular input fields
      const { name, value } = e.target;
      setEvent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e, field) => {
    const files = Array.from(e.target.files);
    setEvent((prev) => ({
      ...prev,
      [`${field}Files`]: [...(prev[`${field}Files`] || []), ...files],
      [field]: [
        ...(prev[field] || []),
        ...files.map((file) => URL.createObjectURL(file)),
      ],
    }));
  };

  const handleHotelChange = (index, field, value) => {
    setEvent((prev) => {
      const newHotels = [...prev.eventDetails.hotels];
      newHotels[index] = { ...newHotels[index], [field]: value };
      return {
        ...prev,
        eventDetails: { ...prev.eventDetails, hotels: newHotels },
      };
    });
  };

  const handleHotelImageUpload = (index, e) => {
    const files = Array.from(e.target.files);
    setEvent((prev) => {
      const newHotels = [...prev.eventDetails.hotels];
      newHotels[index] = {
        ...newHotels[index],
        imageFiles: [...(newHotels[index].imageFiles || []), ...files],
        images: [
          ...(newHotels[index].images || []),
          ...files.map((file) => URL.createObjectURL(file)),
        ],
      };
      return {
        ...prev,
        eventDetails: { ...prev.eventDetails, hotels: newHotels },
      };
    });
  };

  const handleFlightChange = (index, field, value) => {
    setEvent((prev) => {
      const newFlights = [...prev.flights];
      newFlights[index] = { ...newFlights[index], [field]: value };
      return { ...prev, flights: newFlights };
    });
  };

  const addHotel = () => {
    setEvent((prev) => ({
      ...prev,
      eventDetails: {
        ...prev.eventDetails,
        hotels: [
          ...prev.eventDetails.hotels,
          {
            name: "",
            location: "",
            description: "",
            images: [],
            imageFiles: [],
          },
        ],
      },
    }));
  };

  const removeHotel = (index) => {
    setEvent((prev) => ({
      ...prev,
      eventDetails: {
        ...prev.eventDetails,
        hotels: prev.eventDetails.hotels.filter((_, i) => i !== index),
      },
    }));
  };

  const addFlight = () => {
    setEvent((prev) => ({
      ...prev,
      flights: [
        ...prev.flights,
        {
          departureCity: "",
          destinationCity: "",
          departureDate: "",
          returnDate: "",
        },
      ],
    }));
  };

  const removeFlight = (index) => {
    setEvent((prev) => ({
      ...prev,
      flights: prev.flights.filter((_, i) => i !== index),
    }));
  };

  const handleEventDetailChange = (e, field) => {
    const { value } = e.target;
    setEvent((prev) => ({
      ...prev,
      eventDetails: {
        ...prev.eventDetails,
        [field]: value,
      },
    }));
  };

  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEvent((prev) => ({
        ...prev,
        poster: file,
        posterUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation logic (updated for poster)
    if (event.type === "H" && !event.poster) {
      setError("Poster is required for Hajj events");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    // Append basic fields
    formData.append("title", event.title);
    formData.append("description", event.description);
    formData.append("type", event.type);
    formData.append("duration", event.duration);
    formData.append("pricing", JSON.stringify(event.pricing));
    formData.append("visa", event.visa);
    formData.append("descriptionTitle", event.descriptionTitle);
    formData.append("countryName", event.countryName);
    formData.append("importantNote", event.importantNote);
    formData.append("month", event.month);

    // Append event images
    event.imageFiles.forEach((file) => formData.append("images", file));

    // Append poster if exists
    if (event.poster) {
      formData.append("poster", event.poster);
    }

    // Prepare and append event details
    const eventDetails = {
      ...event.eventDetails,
      hotels: event.eventDetails.hotels.map((hotel) => ({
        name: hotel.name,
        location: hotel.location,
        description: hotel.description,
      })),
    };
    formData.append("eventDetails", JSON.stringify(eventDetails));

    // Append hotel images
    event.eventDetails.hotels.forEach((hotel, index) => {
      hotel.imageFiles.forEach((file) => {
        formData.append(`hotelimages[${index}]`, file);
      });
    });

    // Append flight details
    formData.append(
      "flightDetails",
      JSON.stringify(
        event.flights.map((flight) => ({
          ...flight,
          date: new Date(flight.date).toISOString(),
        }))
      )
    );

    try {
      const response = await fetch(
        `http://localhost:3000/pages/apis/events/createEvent`,
        {
          method: "POST",
          body: formData,
        }
      );

      // ... rest of response handling remains the same
    } catch (error) {
      // ... error handling
    }
  };

  // Updated form sections
  return (
    <div className="flex flex-col space-y-6 w-full">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Create New Event
      </h1>
      {error && <p className="text-red-500">{error}</p>}
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
                      value={event.images
                        .filter((img) => !img.startsWith("blob:"))
                        .join(",")}
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
                    <p className="text-sm text-gray-500">
                      {event.images.length} image(s) selected
                    </p>
                  </div>
                  {event.images.length < 3 && (
                    <p className="text-sm text-red-500">
                      At least three images are required.
                    </p>
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
                  <Select
                    name="type"
                    value={event.type}
                    onValueChange={(value) => handleChange(value, "type")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hajj">Hajj</SelectItem>
                      <SelectItem value="Umrah">Umrah</SelectItem>
                      <SelectItem value="Tour">Tour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {event.type === "Tour" && (
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

                {/* Updated poster section */}
                {event.type === "H" && (
                  <div className="space-y-2">
                    <Label htmlFor="poster">Poster (Upload)</Label>
                    <div className="flex flex-col space-y-2">
                      <Input
                        id="poster"
                        type="file"
                        accept="image/*"
                        onChange={handlePosterUpload}
                      />
                      {event.posterUrl && (
                        <img
                          src={event.posterUrl}
                          alt="Poster preview"
                          className="h-32 w-32 object-cover"
                        />
                      )}
                    </div>
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
                    value={
                      typeof event.pricing === "object"
                        ? JSON.stringify(event.pricing, null, 2)
                        : event.pricing
                    }
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setEvent((prev) => ({ ...prev, pricing: parsed }));
                      } catch (error) {
                        setEvent((prev) => ({
                          ...prev,
                          pricing: e.target.value,
                        }));
                      }
                    }}
                    required
                  />
                  {typeof event.pricing === "string" && (
                    <p className="text-sm text-yellow-500">
                      Warning: Current pricing is not valid JSON. Please correct
                      it before submitting.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visa">Visa</Label>
                  <Select
                    name="visa"
                    value={event.visa}
                    onValueChange={(value) => handleChange(value, "visa")}
                  >
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
                {/* Updated event details fields */}
                <div className="space-y-2">
                  <Label htmlFor="exclusion">Exclusion</Label>
                  <Input
                    id="exclusion"
                    name="exclusion"
                    value={event.eventDetails.exclusion}
                    onChange={(e) => handleEventDetailChange(e, "exclusion")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inclusion">Inclusion</Label>
                  <Input
                    id="inclusion"
                    name="inclusion"
                    value={event.eventDetails.inclusion}
                    onChange={(e) => handleEventDetailChange(e, "inclusion")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transportation">Transportation</Label>
                  <Input
                    id="transportation"
                    name="transportation"
                    value={event.eventDetails.transportation}
                    onChange={(e) =>
                      handleEventDetailChange(e, "transportation")
                    }
                    required
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
                      <CardTitle className="text-lg">
                        Hotel {index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`hotelName-${index}`}>Hotel Name</Label>
                        <Input
                          id={`hotelName-${index}`}
                          value={hotel.name}
                          onChange={(e) =>
                            handleHotelChange(index, "name", e.target.value)
                          }
                          required
                          minLength={3}
                          maxLength={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`hotelLocation-${index}`}>
                          Location
                        </Label>
                        <Input
                          id={`hotelLocation-${index}`}
                          value={hotel.location}
                          onChange={(e) =>
                            handleHotelChange(index, "location", e.target.value)
                          }
                          required
                          minLength={3}
                          maxLength={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`hotelDescription-${index}`}>
                          Description
                        </Label>
                        <Textarea
                          id={`hotelDescription-${index}`}
                          value={hotel.description}
                          onChange={(e) =>
                            handleHotelChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          required
                          minLength={10}
                          maxLength={1000}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`hotelImages-${index}`}>
                          Images (upload from device)
                        </Label>
                        <div className="flex flex-col space-y-2">
                          <Input
                            id={`hotelImages-${index}`}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleHotelImageUpload(index, e)}
                          />
                          <p className="text-sm text-gray-500">
                            {hotel.images.length} image(s) selected
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeHotel(index)}
                      >
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
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          Flight {index + 1}
                        </CardTitle>
                        <Select
                          value={flight.type}
                          onValueChange={(value) => {
                            handleFlightChange(index, "type", value);
                            if (value === "return") {
                              handleFlightChange(
                                index,
                                "destinationCity",
                                flight.departureCity
                              );
                            }
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Flight Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="departure">Departure</SelectItem>
                            <SelectItem value="return">Return</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`departureCity-${index}`}>
                            Departure City
                          </Label>
                          <Input
                            id={`departureCity-${index}`}
                            value={flight.departureCity}
                            onChange={(e) => {
                              handleFlightChange(
                                index,
                                "departureCity",
                                e.target.value
                              );
                              if (flight.type === "return") {
                                handleFlightChange(
                                  index,
                                  "destinationCity",
                                  e.target.value
                                );
                              }
                            }}
                            required
                            minLength={2}
                            maxLength={100}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`destinationCity-${index}`}>
                            Destination City
                          </Label>
                          <Input
                            id={`destinationCity-${index}`}
                            value={
                              flight.type === "return"
                                ? flight.departureCity
                                : flight.destinationCity
                            }
                            onChange={(e) => {
                              if (flight.type !== "return") {
                                handleFlightChange(
                                  index,
                                  "destinationCity",
                                  e.target.value
                                );
                              }
                            }}
                            required
                            minLength={2}
                            maxLength={100}
                            disabled={flight.type === "return"}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`date-${index}`}>Date</Label>
                          <Input
                            id={`date-${index}`}
                            type="date"
                            value={flight.date}
                            onChange={(e) =>
                              handleFlightChange(index, "date", e.target.value)
                            }
                            required
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeFlight(index)}
                      >
                        Remove Flight
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                <Button type="button" onClick={addFlight} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Flight
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating Event..." : "Create Event"}
        </Button>
      </form>
    </div>
  );
}
