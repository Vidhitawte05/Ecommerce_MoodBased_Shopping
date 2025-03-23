"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { FileText, Truck, Download } from "lucide-react"
import type { Order } from "@/lib/db"

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/account/orders")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        setIsOrdersLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("You must be signed in to view your orders")
        }

        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await response.json()

        // Store orders in localStorage for persistence
        localStorage.setItem(`orders_${user.id}`, JSON.stringify(data.orders))

        setOrders(data.orders)
      } catch (error) {
        console.error("Error fetching orders:", error)

        // Try to get orders from localStorage as fallback
        const savedOrders = localStorage.getItem(`orders_${user.id}`)
        if (savedOrders) {
          try {
            setOrders(JSON.parse(savedOrders))
            return
          } catch (e) {
            console.error("Error parsing saved orders:", e)
          }
        }

        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load orders",
          variant: "destructive",
        })
      } finally {
        setIsOrdersLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user, toast])

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  if (!isAuthenticated) {
    return null // Router will redirect
  }

  const handleViewDetails = (orderId: string) => {
    router.push(`/account/orders/${orderId}`)
  }

  const handleTrackOrder = (orderId: string) => {
    router.push(`/track-order?orderId=${orderId}`)
  }

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("You must be signed in to download invoices")
      }

      const response = await fetch(`/api/invoice/${orderId}`, {
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
      a.download = `invoice-${orderId}.pdf`
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

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {isOrdersLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Orders Yet</CardTitle>
            <CardDescription>You haven't placed any orders yet.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewDetails}
                  onTrackOrder={handleTrackOrder}
                  onDownloadInvoice={handleDownloadInvoice}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="processing">
            <div className="space-y-6">
              {orders
                .filter((order) => order.status === "processing")
                .map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                    onTrackOrder={handleTrackOrder}
                    onDownloadInvoice={handleDownloadInvoice}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="shipped">
            <div className="space-y-6">
              {orders
                .filter((order) => order.status === "shipped")
                .map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                    onTrackOrder={handleTrackOrder}
                    onDownloadInvoice={handleDownloadInvoice}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="delivered">
            <div className="space-y-6">
              {orders
                .filter((order) => order.status === "delivered")
                .map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                    onTrackOrder={handleTrackOrder}
                    onDownloadInvoice={handleDownloadInvoice}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function OrderCard({
  order,
  onViewDetails,
  onTrackOrder,
  onDownloadInvoice,
}: {
  order: Order
  onViewDetails: (orderId: string) => void
  onTrackOrder: (orderId: string) => void
  onDownloadInvoice: (orderId: string) => void
}) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Order #{order.id}</CardTitle>
            <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0 ${statusColors[order.status]}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Items</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.quantity}x Product #{item.productId}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(order.id)}>
          <FileText size={16} className="mr-2" />
          View Details
        </Button>
        <Button variant="outline" size="sm" onClick={() => onTrackOrder(order.id)}>
          <Truck size={16} className="mr-2" />
          Track Order
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDownloadInvoice(order.id)}>
          <Download size={16} className="mr-2" />
          Download Invoice
        </Button>
      </CardFooter>
    </Card>
  )
}

