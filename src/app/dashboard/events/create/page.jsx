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
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateEventPage() {
  const [event, setEvent] = useState({
    title: "",
    images: [], // for preview URLs
    imageFiles: [], // for file objects
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
      inclusion: [],
      exclusion: [],
      transportation: [],
    },
    hotels: [], // each hotel may have its own imageFiles and preview URLs
    flights: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const initialPricing = {};
  const initialPricingText =
    typeof initialPricing === "object"
      ? Object.entries(initialPricing)
          .map(([key, value]) => `${key}:${value}`)
          .join(",")
      : initialPricing || "";

  const [pricingText, setPricingText] = useState(initialPricingText);
  const [pricing, setPricing] = useState(
    typeof initialPricing === "object" ? initialPricing : {}
  );

  const handleChange = (e, name = null) => {
    if (name) {
      setEvent((prev) => ({ ...prev, [name]: e }));
    } else {
      const { name, value } = e.target;
      setEvent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e, field) => {
    const files = Array.from(e.target.files);
    // Save both file objects (for upload) and blob URLs (for preview)
    setEvent((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files],
      images: [
        ...prev.images,
        ...files.map((file) => URL.createObjectURL(file)),
      ],
    }));
  };

  const handleHotelChange = (index, field, value) => {
    setEvent((prev) => {
      const newHotels = [...prev.hotels];
      newHotels[index] = { ...newHotels[index], [field]: value };
      return { ...prev, hotels: newHotels };
    });
  };

  const handleHotelImageUpload = (index, e) => {
    const files = Array.from(e.target.files);
    setEvent((prev) => {
      const newHotels = [...prev.hotels];
      newHotels[index] = {
        ...newHotels[index],
        imageFiles: [...(newHotels[index].imageFiles || []), ...files],
        images: [
          ...(newHotels[index].images || []),
          ...files.map((file) => URL.createObjectURL(file)),
        ],
      };
      return { ...prev, hotels: newHotels };
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
      hotels: [
        ...prev.hotels,
        {
          name: "",
          locationDescription: "",
          description: "",
          accomodationDescription: "",
          images: [],
          imageFiles: [],
          city: "",
        },
      ],
    }));
  };

  const removeHotel = (index) => {
    setEvent((prev) => ({
      ...prev,
      hotels: prev.hotels.filter((_, i) => i !== index),
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
          date: "",
          type: "Departure", // default flight type
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
    // Convert text input to array by splitting on commas or new lines
    const items = value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    setEvent((prev) => ({
      ...prev,
      eventDetails: {
        ...prev.eventDetails,
        [field]: items,
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

  const handleBlur = () => {
    const pricingPairs = pricingText.split(",").map((pair) => pair.trim());
    const newPricing = pricingPairs.reduce((acc, pair) => {
      const [key, value] = pair.split(":");
      if (key && value) {
        acc[key.trim()] = Number(value.trim());
      }
      return acc;
    }, {});
    setPricing(newPricing);
    setEvent((prev) => ({ ...prev, pricing: newPricing }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Convert pricing text to object
    const pricingObj = pricingText.split(",").reduce((acc, pair) => {
      const [key, value] = pair.split(":");
      if (key && value) acc[key.trim()] = Number(value.trim());
      return acc;
    }, {});

    const formData = new FormData();

    // 1. Append basic fields
    const eventData = {
      title: event.title,
      description: event.description,
      type: event.type,
      duration: event.duration,
      pricing: JSON.stringify(pricingObj),
      visa: event.visa,
      descriptionTitle: event.descriptionTitle,
      countryName: event.type === "T" ? event.countryName : "",
      importantNote: event.importantNote,
      month: event.month,
      eventDetails: JSON.stringify(event.eventDetails),
      hotels: JSON.stringify(
        event.hotels.map((h) => ({
          ...h,
          images: [], // Remove blob URLs – backend will handle actual images from files
        }))
      ),
      flightDetails: JSON.stringify(event.flights),
    };

    Object.entries(eventData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // 2. Append image FILES (using the file objects, not blob URLs)
    // Event images
    (event.imageFiles || []).forEach((file) => {
      formData.append("images", file);
    });

    // Hotel images: use hotel.imageFiles
    event.hotels.forEach((hotel, index) => {
      (hotel.imageFiles || []).forEach((file) => {
        formData.append(`hotelimages[${index}]`, file);
      });
    });

    // 3. Append poster if exists
    if (event.poster) {
      formData.append("poster", event.poster);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/pages/apis/events/createEvent",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        router.push("/dashboard/events");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

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
                  <Label htmlFor="title">Title</Label>
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
                  <Label htmlFor="images">
                    Images (enter URLs or upload from device)
                  </Label>
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
                      <SelectItem value="H">Hajj</SelectItem>
                      <SelectItem value="U">Umrah</SelectItem>
                      <SelectItem value="T">Tour</SelectItem>
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
                  <Label htmlFor="pricing">
                    Pricing (comma-separated key:value pairs)
                  </Label>
                  <Input
                    id="pricing"
                    name="pricing"
                    value={pricingText}
                    onChange={(e) => setPricingText(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="e.g., Quad:1000,Double:2000"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Enter pricing in the format: <code>key:value,key:value</code>
                  </p>
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
                {/* Event details fields */}
                <div className="space-y-2">
                  <Label htmlFor="exclusion">Exclusion</Label>
                  <Textarea
                    id="exclusion"
                    name="exclusion"
                    value={event.eventDetails.exclusion}
                    onChange={(e) => handleEventDetailChange(e, "exclusion")}
                    required
                    minLength={50}
                    maxLength={10000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inclusion">Inclusion</Label>
                  <Textarea
                    id="inclusion"
                    name="inclusion"
                    value={event.eventDetails.inclusion}
                    onChange={(e) => handleEventDetailChange(e, "inclusion")}
                    required
                    minLength={50}
                    maxLength={10000}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transportation">Transportation</Label>
                  <Textarea
                    id="transportation"
                    name="transportation"
                    value={event.eventDetails.transportation}
                    onChange={(e) =>
                      handleEventDetailChange(e, "transportation")
                    }
                    required
                    minLength={5}
                    maxLength={10000}
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
                {event.hotels.map((hotel, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Hotel {index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`hotelName-${index}`}>
                          Hotel Name
                        </Label>
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
                        <Label htmlFor={`hotelLocationDescription-${index}`}>
                          Location Description
                        </Label>
                        <Input
                          id={`hotelLocationDescription-${index}`}
                          value={hotel.locationDescription}
                          onChange={(e) =>
                            handleHotelChange(
                              index,
                              "locationDescription",
                              e.target.value
                            )
                          }
                          minLength={10}
                          maxLength={1000}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`hotelAccomodationDescription-${index}`}>
                          Accomodation Description
                        </Label>
                        <Input
                          id={`hotelAccomodationDescription-${index}`}
                          value={hotel.accomodationDescription}
                          onChange={(e) =>
                            handleHotelChange(
                              index,
                              "accomodationDescription",
                              e.target.value
                            )
                          }
                          minLength={10}
                          maxLength={1000}
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
                        <Label htmlFor={`hotelCity-${index}`}>City</Label>
                        <Input
                          id={`hotelCity-${index}`}
                          value={hotel.city}
                          onChange={(e) =>
                            handleHotelChange(index, "city", e.target.value)
                          }
                          required
                          minLength={3}
                          maxLength={20}
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
                            {(hotel.images || []).length} image(s) selected
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
                      <CardTitle className="text-lg">
                        Flight {index + 1}
                      </CardTitle>
                      <Select
                        value={flight.type}
                        onValueChange={(value) =>
                          handleFlightChange(index, "type", value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Flight Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Departure">
                            Departure
                          </SelectItem>
                          <SelectItem value="Return">Return</SelectItem>
                        </SelectContent>
                      </Select>
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
                            onChange={(e) =>
                              handleFlightChange(
                                index,
                                "departureCity",
                                e.target.value
                              )
                            }
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
                            value={flight.destinationCity}
                            onChange={(e) =>
                              handleFlightChange(
                                index,
                                "destinationCity",
                                e.target.value
                              )
                            }
                            required
                            minLength={2}
                            maxLength={100}
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
