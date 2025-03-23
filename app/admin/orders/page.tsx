"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft, Eye, Search } from "lucide-react"
import type { Order } from "@/lib/db"

export default function AdminOrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Admin check - in a real app, you'd check for admin role
  const isAdmin = isAuthenticated && user?.email === "admin@example.com"

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/admin/orders")
    } else if (!isLoading && !isAdmin) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAdmin) return

      try {
        setIsOrdersLoading(true)

        // In a real app, you would fetch from your API
        // For now, we'll simulate with localStorage
        const ordersData = localStorage.getItem("db_orders")
        let allOrders: Order[] = []

        if (ordersData) {
          const ordersObj = JSON.parse(ordersData)
          // Flatten the orders object into an array
          Object.values(ordersObj).forEach((userOrders: any) => {
            allOrders = [...allOrders, ...userOrders]
          })
        }

        // Sort by date (newest first)
        allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        setOrders(allOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        })
      } finally {
        setIsOrdersLoading(false)
      }
    }

    if (isAdmin) {
      fetchOrders()
    }
  }, [isAdmin, toast])

  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      // In a real app, you would call your API
      // For now, we'll update localStorage directly
      const ordersData = localStorage.getItem("db_orders")
      if (ordersData) {
        const ordersObj = JSON.parse(ordersData)

        // Find the order and update its status
        let updated = false
        for (const userId in ordersObj) {
          const userOrders = ordersObj[userId]
          const orderIndex = userOrders.findIndex((order: Order) => order.id === orderId)

          if (orderIndex !== -1) {
            userOrders[orderIndex].status = status
            updated = true
            break
          }
        }

        if (updated) {
          localStorage.setItem("db_orders", JSON.stringify(ordersObj))

          // Update the orders state
          setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))

          toast({
            title: "Success",
            description: `Order status updated to ${status}`,
          })
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false
    }

    // Filter by search query (order ID)
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  if (!isAuthenticated || !isAdmin) {
    return <div className="container mx-auto px-4 py-12 text-center">Access denied. Admin privileges required.</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Order Management</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isOrdersLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Orders Found</CardTitle>
            <CardDescription>
              {searchQuery || statusFilter !== "all"
                ? "No orders match your search criteria."
                : "There are no orders in your store yet."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="border rounded-md">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b bg-muted/50">
            <div className="col-span-2">Order ID</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-1">Items</div>
            <div className="col-span-1">Total</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>

          {filteredOrders.map((order) => (
            <div key={order.id} className="grid grid-cols-12 gap-4 p-4 border-b items-center">
              <div className="col-span-2">{order.id}</div>
              <div className="col-span-2">{new Date(order.createdAt).toLocaleDateString()}</div>
              <div className="col-span-2">User ID: {order.userId.substring(0, 8)}</div>
              <div className="col-span-1">{order.items.length}</div>
              <div className="col-span-1">${order.total.toFixed(2)}</div>
              <div className="col-span-2">
                <Select
                  defaultValue={order.status}
                  onValueChange={(value) => handleUpdateOrderStatus(order.id, value as Order["status"])}
                >
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/orders/${order.id}`}>
                    <Eye size={16} className="mr-2" />
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

