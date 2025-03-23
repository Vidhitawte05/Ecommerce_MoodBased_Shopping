"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft, Download, Truck } from "lucide-react"
import type { Order } from "@/lib/db"

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isOrderLoading, setIsOrderLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/signin?redirect=/account/orders/${params.orderId}`)
    }
  }, [isLoading, isAuthenticated, router, params.orderId])

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) return

      try {
        setIsOrderLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("You must be signed in to view order details")
        }

        const response = await fetch(`/api/orders/${params.orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }

        const data = await response.json()

        // Store order in localStorage for persistence
        localStorage.setItem(`order_${params.orderId}`, JSON.stringify(data.order))

        setOrder(data.order)
      } catch (error) {
        console.error("Error fetching order:", error)

        // Try to get order from localStorage as fallback
        const savedOrder = localStorage.getItem(`order_${params.orderId}`)
        if (savedOrder) {
          try {
            setOrder(JSON.parse(savedOrder))
            return
          } catch (e) {
            console.error("Error parsing saved order:", e)
          }
        }

        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load order details",
          variant: "destructive",
        })
      } finally {
        setIsOrderLoading(false)
      }
    }

    if (user) {
      fetchOrder()
    }
  }, [user, params.orderId, toast])

  const handleDownloadInvoice = async () => {
    if (!order) return

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("You must be signed in to download invoices")
      }

      const response = await fetch(`/api/invoice/${order.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to download invoice")
      }

      // Create a blob from the PDF stream
      const blob = await response.blob()

      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${order.id}.pdf`
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "Invoice downloaded successfully",
      })
    } catch (error) {
      console.error("Error downloading invoice:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to download invoice",
        variant: "destructive",
      })
    }
  }

  const handleTrackOrder = () => {
    if (!order) return
    router.push(`/track-order?orderId=${order.id}`)
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  if (!isAuthenticated) {
    return null // Router will redirect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/account/orders">
            <ArrowLeft size={16} className="mr-2" />
            Back to Orders
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>

      {isOrderLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      ) : !order ? (
        <Card>
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>
              The order you're looking for doesn't exist or you don't have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/account/orders">View All Orders</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order #{order.id}</CardTitle>
                <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Items</h3>
                    <div className="border rounded-md divide-y">
                      {order.items.map((item, index) => (
                        <div key={index} className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium">Product #{item.productId}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Order Summary</h3>
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>Included</span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {order.trackingInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Tracking Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Carrier</p>
                        <p className="font-medium">{order.trackingInfo.carrier}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tracking Number</p>
                        <p className="font-medium">{order.trackingInfo.trackingNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                        <p className="font-medium">{order.trackingInfo.estimatedDelivery}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Tracking History</h4>
                      <div className="border rounded-md divide-y">
                        {order.trackingInfo.trackingHistory.map((event, index) => (
                          <div key={index} className="p-3">
                            <div className="flex justify-between mb-1">
                              <p className="font-medium">{event.status}</p>
                              <p className="text-sm text-muted-foreground">{event.timestamp}</p>
                            </div>
                            <p className="text-sm">{event.location}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">Payment Method</p>
                <p>{order.paymentMethod}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      order.status === "pending"
                        ? "bg-yellow-500"
                        : order.status === "processing"
                          ? "bg-blue-500"
                          : order.status === "shipped"
                            ? "bg-purple-500"
                            : "bg-green-500"
                    }`}
                  ></div>
                  <p className="font-medium">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button className="w-full" onClick={handleTrackOrder}>
                  <Truck size={16} className="mr-2" />
                  Track Order
                </Button>
                <Button variant="outline" className="w-full" onClick={handleDownloadInvoice}>
                  <Download size={16} className="mr-2" />
                  Download Invoice
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

