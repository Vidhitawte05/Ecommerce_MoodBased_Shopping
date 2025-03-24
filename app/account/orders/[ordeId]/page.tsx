"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft, Download, Truck } from "lucide-react"
import Link from "next/link"

interface OrderItem {
  id: string
  productId: number
  quantity: number
  price: number
  product: {
    id: number
    name: string
    price: number
    images: string[]
  }
}

interface Order {
  id: string
  userId: string
  status: string
  total: number
  shippingAddress: any
  paymentMethod: string
  paymentId: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export default function OrderDetailsPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/auth/signin?redirect=/account/orders/${params.orderId}`)
    }
  }, [authLoading, isAuthenticated, router, params.orderId])

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication required")
        }

        const response = await fetch(`/api/orders/${params.orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Order not found")
          } else {
            throw new Error("Failed to fetch order details")
          }
        }

        const data = await response.json()
        setOrder(data.order)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError(err instanceof Error ? err.message : "An error occurred")

        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to load order details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated && params.orderId) {
      fetchOrderDetails()
    }
  }, [isAuthenticated, params.orderId, toast])

  const handleDownloadInvoice = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`/api/invoice/${params.orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to download invoice")
      }

      // Create a blob from the response
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link and trigger download
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${params.orderId}.pdf`
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "Invoice downloaded successfully",
      })
    } catch (err) {
      console.error("Error downloading invoice:", err)

      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to download invoice",
        variant: "destructive",
      })
    }
  }

  const handleTrackOrder = () => {
    router.push(`/track-order?orderId=${params.orderId}`)
  }

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/account/orders">Back to Orders</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>
              The order you're looking for doesn't exist or you don't have permission to view it.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/account/orders">Back to Orders</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Format the shipping address for display
  const shippingAddress = order.shippingAddress
  const formattedAddress =
    typeof shippingAddress === "string"
      ? shippingAddress
      : `${shippingAddress.firstName} ${shippingAddress.lastName}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}, ${shippingAddress.country}`

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/account/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Order #{order.id}</CardTitle>
                  <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0 ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product?.images?.[0] || "/placeholder.svg"}
                            alt={item.product?.name || `Product ${item.productId}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.product?.name || `Product #${item.productId}`}</div>
                          <div className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="font-medium">${(item.quantity * item.price).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${(order.total * 0.92).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${(order.total * 0.08 * 0.25).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${(order.total * 0.08 * 0.75).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-4">
              <Button variant="outline" onClick={handleTrackOrder}>
                <Truck className="mr-2 h-4 w-4" />
                Track Order
              </Button>
              <Button variant="outline" onClick={handleDownloadInvoice}>
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">{formattedAddress}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">Payment Method</p>
                <p className="text-muted-foreground">
                  {order.paymentMethod === "paypal"
                    ? "PayPal"
                    : order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : order.paymentMethod}
                </p>
                {order.paymentId && (
                  <>
                    <p className="font-medium mt-4">Payment ID</p>
                    <p className="text-muted-foreground">{order.paymentId}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions or issues with your order, please contact our customer support.
              </p>
              <Button asChild className="w-full">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

