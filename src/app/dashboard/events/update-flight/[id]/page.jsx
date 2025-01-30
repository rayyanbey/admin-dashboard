"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

export default function UpdateFlightPage() {
  const { id } = useParams();
  const [flights, setFlights] = useState([]);
  const [selectedFlightIndex, setSelectedFlightIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadFlightData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/pages/apis/events/getFlights/${id}`
        );
        if (response.data?.data) {
          setFlights(response.data.data);
        } else {
          console.error("No flight data found.");
        }
      } catch (error) {
        console.error("Error fetching flight data:", error);
      } finally {
        setLoading(false);
      }
    };
    if(id){
      loadFlightData()
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlights(prev => {
      const updatedFlights = [...prev];
      updatedFlights[selectedFlightIndex] = {
        ...updatedFlights[selectedFlightIndex],
        [name]: value
      };
      return updatedFlights;
    });
  };

  const handleTypeChange = (value) => {
    setFlights(prev => {
      const updatedFlights = [...prev];
      updatedFlights[selectedFlightIndex] = {
        ...updatedFlights[selectedFlightIndex],
        type: value
      };
      return updatedFlights;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("flightId", flights[selectedFlightIndex].id);
      formData.append("flightDetails", JSON.stringify(flights[selectedFlightIndex]));

      await axios.put(
        `http://localhost:3000/pages/apis/events/updateFlightDetails/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Flight updated successfully!");
    } catch (error) {
      console.error("Error updating flight:", error);
      alert("Failed to update the flight.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading flight details...</div>;
  if (!flights.length) return <div className="text-red-500">Flight details not found.</div>;

  return (
    <div className="flex flex-col space-y-6 w-full">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        Update Flight Details
      </h1>

      <div className="space-y-2">
        <Label htmlFor="flightSelect">Select Flight</Label>
        <Select 
          value={selectedFlightIndex.toString()} 
          onValueChange={(value) => setSelectedFlightIndex(parseInt(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Flight" />
          </SelectTrigger>
          <SelectContent>
            {flights.map((flight, index) => (
              <SelectItem key={index} value={index.toString()}>
                Flight {index + 1}: {flight.departureCity} to {flight.destinationCity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="flight" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="flight">Flight Details</TabsTrigger>
          </TabsList>
          <TabsContent value="flight">
            <Card>
              <CardHeader>
                <CardTitle>Flight Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureCity">Departure City</Label>
                    <Input
                      id="departureCity"
                      name="departureCity"
                      value={flights[selectedFlightIndex]?.departureCity || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinationCity">Destination City</Label>
                    <Input
                      id="destinationCity"
                      name="destinationCity"
                      value={flights[selectedFlightIndex]?.destinationCity || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={flights[selectedFlightIndex]?.date ? flights[selectedFlightIndex].date.split("T")[0] : ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Flight Type</Label>
                    <Select 
                      value={flights[selectedFlightIndex]?.type || ""} 
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Flight Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Departure">Departure</SelectItem>
                        <SelectItem value="Return">Return</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={updating}>
                  {updating ? "Updating..." : "Update Flight"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}