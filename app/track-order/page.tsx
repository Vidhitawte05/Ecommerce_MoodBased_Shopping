"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Package, Truck, CheckCircle, MapPin, Calendar, Clock } from "lucide-react"

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
const orderId = searchParams?.get("id") ?? "";

  const [orderNumber, setOrderNumber] = useState(orderId || "")
  const [trackingInfo, setTrackingInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order number",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Update the API endpoint to use the consistent parameter name
      const response = await fetch(`/api/orders/${orderNumber}/tracking`)

      if (!response.ok) {
        throw new Error("Failed to fetch tracking information")
      }

      const data = await response.json()
      setTrackingInfo(data.tracking)

      if (!data.tracking) {
        toast({
          title: "No tracking information",
          description: "We couldn't find tracking information for this order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error tracking order:", error)
      toast({
        title: "Error",
        description: "Failed to track order. Please try again later.",
        variant: "destructive",
      })

      // For demo purposes, set mock tracking data
      setTrackingInfo({
        orderId: orderNumber,
        status: "shipped",
        estimatedDelivery: "2025-03-25",
        carrier: "FastShip Express",
        trackingNumber: "FS" + Math.floor(Math.random() * 10000000),
        events: [
          {
            date: "2025-03-20T10:30:00Z",
            status: "Order Placed",
            location: "Online",
            description: "Your order has been received and is being processed.",
          },
          {
            date: "2025-03-21T14:15:00Z",
            status: "Processing",
            location: "Warehouse",
            description: "Your order is being prepared for shipment.",
          },
          {
            date: "2025-03-22T09:45:00Z",
            status: "Shipped",
            location: "Distribution Center",
            description: "Your order has been shipped and is on its way.",
          },
        ],
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If orderId is provided in URL, track automatically
  useEffect(() => {
    if (orderId) {
      handleTrackOrder()
    }
  }, [orderId])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes("process")) return <Clock className="h-5 w-5 text-blue-500" />
    if (statusLower.includes("ship")) return <Truck className="h-5 w-5 text-purple-500" />
    if (statusLower.includes("deliver")) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <Package className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Order Number</CardTitle>
            <CardDescription>Enter your order number to track the status and location of your package</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Order number (e.g., ORD-123456)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleTrackOrder} disabled={isLoading}>
                {isLoading ? "Tracking..." : "Track Order"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {trackingInfo && (
          <Card>
            <CardHeader className="bg-muted/50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Order #{trackingInfo.orderId}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    Estimated Delivery: {new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge
                  className={`
                    ${
                      trackingInfo.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : trackingInfo.status === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                    } 
                    px-3 py-1
                  `}
                >
                  {trackingInfo.status.charAt(0).toUpperCase() + trackingInfo.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-medium mb-2">Shipping Carrier</h3>
                  <p className="text-muted-foreground">{trackingInfo.carrier}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Tracking Number</h3>
                  <p className="text-muted-foreground">{trackingInfo.trackingNumber}</p>
                </div>
              </div>

              <Tabs defaultValue="timeline">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="map">Map View</TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="mt-6">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    {/* Timeline events */}
                    <div className="space-y-8">
                      {trackingInfo.events.map((event: any, index: number) => (
                        <div key={index} className="relative pl-12">
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {getStatusIcon(event.status)}
                          </div>

                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <h3 className="font-medium">{event.status}</h3>
                              <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                            </div>
                            <div className="flex items-start gap-2 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <p className="text-sm text-muted-foreground">{event.location}</p>
                            </div>
                            <p className="mt-2">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="map" className="mt-6">
                  <div className="bg-muted/30 rounded-lg p-8 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Map View Coming Soon</h3>
                    <p className="text-muted-foreground">
                      We're working on adding a visual map to track your package's journey.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="bg-muted/30 border-t">
              <p className="text-sm text-muted-foreground">
                Having issues with your delivery?{" "}
                <a href="#" className="text-primary hover:underline">
                  Contact Support
                </a>
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

