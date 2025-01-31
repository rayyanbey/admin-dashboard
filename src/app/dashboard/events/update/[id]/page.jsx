"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import axios from "axios";

export default function UpdateEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState({ eventDetails: {} });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/pages/apis/events/getDetails/${id}`
        );
        setEvent(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in event.eventDetails) {
      setEvent((prev) => ({
        ...prev,
        eventDetails: { ...prev.eventDetails, [name]: value },
      }));
    } else {
      setEvent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const field = e.target.name;
      setEvent((prev) => ({
        ...prev,
        [`${field}File`]: file,
        [field]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)
  
    try {
      const formData = new FormData()
  
      // Append main event fields
      const eventUpdate = {
        title: event.title,
        description: event.description,
        type: event.type,
        duration: parseInt(event.duration),
        pricing: JSON.stringify(event.pricing), // Ensure pricing is stringified
        visa: event.visa,
        descriptionTitle: event.descriptionTitle,
        importantNote: event.importantNote,
        month: event.month,
        countryName: event.type === 'T' ? event.countryName : null,
      }
  
      Object.entries(eventUpdate).forEach(([key, value]) => {
        formData.append(key, value)
      })
  
      // Append eventDetails as a JSON string
      formData.append('eventDetails', JSON.stringify(event.eventDetails))
  
      // Append poster file if exists
      if (event.posterFile) {
        formData.append("poster", event.posterFile)
      }
  
      const response = await axios.put(`http://localhost:3000/pages/apis/events/updateEvent/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
  
      if (response.status === 200) {
        alert("Event updated successfully!")
        router.push("/dashboard/events")
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col space-y-6 w-full">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Update Event: {event.title}
      </h1>
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
                  <Input
                    id="title"
                    name="title"
                    value={event.title || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={event.description || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={event.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
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
                      value={event.countryName || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Input
                    id="month"
                    name="month"
                    value={event.month || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionTitle">Description Title</Label>
                  <Textarea
                    id="descriptionTitle"
                    name="descriptionTitle"
                    value={event.descriptionTitle || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="importantNote">Important Note</Label>
                  <Textarea
                    id="importantNote"
                    name="importantNote"
                    value={event.importantNote || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visa">Visa</Label>
                  <Textarea
                    id="visa"
                    name="visa"
                    value={event.visa || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricing">Pricing</Label>
                  <Textarea
                    id="pricing"
                    name="pricing"
                    value={
                      event.pricing
                        ? JSON.stringify(event.pricing, null, 2)
                        : ""
                    }
                    onChange={(e) => {
                      try {
                        const parsedPricing = JSON.parse(e.target.value);
                        setEvent((prev) => ({
                          ...prev,
                          pricing: parsedPricing,
                        }));
                      } catch (err) {
                        console.error("Invalid JSON", err);
                      }
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={event.duration || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Poster</Label>
                  {event.poster && (
                    <img
                      src={event.poster}
                      alt="Event Poster"
                      className="w-32 h-32 object-cover"
                    />
                  )}
                  <Input
                    type="file"
                    name="poster"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inclusion">Inclusion</Label>
                  <Textarea
                    id="inclusion"
                    name="inclusion"
                    value={event.eventDetails.inclusion || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exclusion">Exclusion</Label>
                  <Textarea
                    id="exclusion"
                    name="exclusion"
                    value={event.eventDetails.exclusion || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transportation">Transportation</Label>
                  <Textarea
                    id="transportation"
                    name="transportation"
                    value={event.eventDetails.transportation || ""}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={updating}>
                  {updating ? "Updating..." : "Update Event"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
