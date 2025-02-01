"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Router from "next/router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import axios from "axios";

export default function UpdateHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const loadHotelsData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/pages/apis/events/getHotels/${id}`
        );
        console.log(response);
        setHotels(response.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        setLoading(false);
      }
    };

    if (id) {
      loadHotelsData();
    }
  }, [id]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setHotels((prevHotels) => {
      const updatedHotels = [...prevHotels];
      updatedHotels[index] = { ...updatedHotels[index], [name]: value };
      return updatedHotels;
    });
  };

  const handleImageUpload = (index, e) => {
    const files = Array.from(e.target.files);
    setHotels((prevHotels) => {
      const updatedHotels = [...prevHotels];
      updatedHotels[index] = {
        ...updatedHotels[index],
        imageFiles: [...(updatedHotels[index].imageFiles || []), ...files],
        images: [
          ...(updatedHotels[index].images || []),
          ...files.map((file) => URL.createObjectURL(file)),
        ],
      };
      return updatedHotels;
    });
  };

  const handleSubmit = async (index, e) => {
    e.preventDefault();
    try {
      const hotelData = hotels[index];

      // Ensure hotelId is sent in the request
      const formData = new FormData();
      formData.append("hotelId", hotelData.id);
      formData.append("name", hotelData.name);
      formData.append("locationDescription", hotelData.locationDescription);
      formData.append("description", hotelData.description);
      formData.append(
        "accomodationDescription",
        hotelData.accomodationDescription
      );
      formData.append("city", hotelData.city);

      // Append images
      if (hotelData.imageFiles) {
        hotelData.imageFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      console.log(formData);
      await axios.put(
        `http://localhost:3000/pages/apis/events/updateHotelDetails/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Hotel updated successfully!");
      
    } catch (error) {
      console.error("Error updating hotel:", error);
      alert("Failed to update the hotel.");
      router.push(`/dashboard/events`);
    }
    finally{
      setUpdating(false)
    }
  };

  if (!id) return <div>Please provide an eventID in the route.</div>;

  if (loading) return <div>Loading hotels...</div>;

  return (
    <div className="flex flex-col space-y-6 w-full">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Update Hotels for Event {id}
      </h1>
      {hotels.length === 0 ? (
      <div className="text-red-500">No hotels found for this event.</div>
      ) : (
      hotels.map((hotel, index) => (
        <form
          key={hotel.id}
          onSubmit={(e) => handleSubmit(index, e)}
          className="space-y-6"
        >
          <Tabs defaultValue={`hotel-${hotel.id}`} className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value={`hotel-${hotel.id}`}>
                Hotel {hotel.name}
              </TabsTrigger>
            </TabsList>
            <TabsContent value={`hotel-${hotel.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>Hotel Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${hotel.id}`}>Hotel Name</Label>
                    <Input
                      id={`name-${hotel.id}`}
                      name="name"
                      value={hotel.name || " "}
                      onChange={(e) => handleChange(index, e)}
                      required
                      minLength={3}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`locationDescription-${hotel.id}`}>
                      Location Description
                    </Label>
                    <Input
                      id={`locationDescription-${hotel.id}`}
                      name="locationDescription"
                      value={hotel.locationDescription || " "}
                      onChange={(e) => handleChange(index, e)}
                      required
                      minLength={3}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`description-${hotel.id}`}>
                      Description
                    </Label>
                    <Textarea
                      id={`description-${hotel.id}`}
                      name="description"
                      value={hotel.description || " "}
                      onChange={(e) => handleChange(index, e)}
                      required
                      minLength={10}
                      maxLength={1000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`accomodationDescription-${hotel.id}`}>
                      Accomodation Description
                    </Label>
                    <Textarea
                      id={`accomodationDescription-${hotel.id}`}
                      name="accomodationDescription"
                      value={hotel.accomodationDescription || " "}
                      onChange={(e) => handleChange(index, e)}
                      required
                      minLength={10}
                      maxLength={1000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`city-${hotel.id}`}>City</Label>
                    <Textarea
                      id={`city-${hotel.id}`}
                      name="city"
                      value={hotel.city || " "}
                      onChange={(e) => handleChange(index, e)}
                      required
                      minLength={3}
                      maxLength={1000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`images-${hotel.id}`}>
                      Images (upload from device)
                    </Label>
                    <div className="flex flex-col space-y-2">
                      <Input
                        id={`images-${hotel.id}`}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(index, e)}
                      />
                      <p className="text-sm text-gray-500">
                        {hotel.images?.length || 0} image(s) selected
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={(e) => handleSubmit(index, e)}
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Update Hotel"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      ))
    )}
    </div>
  );
}
