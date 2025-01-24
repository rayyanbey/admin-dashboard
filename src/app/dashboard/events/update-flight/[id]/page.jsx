"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// This is a dummy function to simulate fetching flight data
const fetchFlightData = async (id) => {
  // In a real application, you would fetch this data from an API
  return {
    id: id,
    departureCity: "Sample Departure",
    destinationCity: "Sample Destination",
    departureDate: "2023-07-01",
    returnDate: "2023-07-10",
  }
}

export default function UpdateFlightPage() {
  const { id } = useParams()
  const [flight, setFlight] = useState(null)

  useEffect(() => {
    const loadFlightData = async () => {
      const data = await fetchFlightData(id)
      setFlight(data)
    }
    loadFlightData()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFlight((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the updated flight data to your backend
    console.log("Updated flight data:", flight)
  }

  if (!flight) return <div>Loading...</div>

  return (
    <div className="flex flex-col space-y-6 w-full">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Update Flight Details</h1>
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
                      value={flight.departureCity}
                      onChange={handleChange}
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinationCity">Destination City</Label>
                    <Input
                      id="destinationCity"
                      name="destinationCity"
                      value={flight.destinationCity}
                      onChange={handleChange}
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureDate">Departure Date</Label>
                    <Input
                      id="departureDate"
                      name="departureDate"
                      type="date"
                      value={flight.departureDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Return Date</Label>
                    <Input
                      id="returnDate"
                      name="returnDate"
                      type="date"
                      value={flight.returnDate}
                      onChange={handleChange}
                      required
                      min={flight.departureDate}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Update Flight
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}

