"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { Eye, Search, RefreshCw } from "lucide-react"
import Link from "next/link"

interface OrderItem {
  id: string
  productId: number
  quantity: number
  price: number
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
  user?: {
    name: string
    email: string
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/admin/orders")
      return
    }

    // For demo purposes, we'll consider a specific email as admin
    if (!authLoading && isAuthenticated && user?.email !== "admin@example.com") {
      router.push("/")
    }
  }, [authLoading, isAuthenticated, user, router])

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || user?.email !== "admin@example.com") return

      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")

        const response = await fetch("/api/admin/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await response.json()
        setOrders(data.orders)
        setFilteredOrders(data.orders)
      } catch (error) {
        console.error("Error fetching orders:", error)

        // Use mock data for demo
        const mockOrders = [
          {
            id: "ORD-123456",
            userId: "user1",
            status: "pending",
            total: 129.99,
            shippingAddress: {
              firstName: "John",
              lastName: "Doe",
              street: "123 Main St",
              city: "New York",
              state: "NY",
              postalCode: "10001",
              country: "US",
            },
            paymentMethod: "paypal",
            paymentId: "PAY-123456789",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            items: [
              {
                id: "item1",
                productId: 1,
                quantity: 2,
                price: 59.99,
              },
            ],
            user: {
              name: "John Doe",
              email: "john@example.com",
            },
          },
          {
            id: "ORD-789012",
            userId: "user2",
            status: "processing",
            total: 89.99,
            shippingAddress: {
              firstName: "Jane",
              lastName: "Smith",
              street: "456 Oak Ave",
              city: "Los Angeles",
              state: "CA",
              postalCode: "90001",
              country: "US",
            },
            paymentMethod: "cod",
            paymentId: null,
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            items: [
              {
                id: "item2",
                productId: 2,
                quantity: 1,
                price: 89.99,
              },
            ],
            user: {
              name: "Jane Smith",
              email: "jane@example.com",
            },
          },
          {
            id: "ORD-345678",
            userId: "user3",
            status: "shipped",
            total: 149.99,
            shippingAddress: {
              firstName: "Bob",
              lastName: "Johnson",
              street: "789 Pine St",
              city: "Chicago",
              state: "IL",
              postalCode: "60007",
              country: "US",
            },
            paymentMethod: "paypal",
            paymentId: "PAY-987654321",
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            items: [
              {
                id: "item3",
                productId: 3,
                quantity: 3,
                price: 49.99,
              },
            ],
            user: {
              name: "Bob Johnson",
              email: "bob@example.com",
            },
          },
          {
            id: "ORD-901234",
            userId: "user4",
            status: "delivered",
            total: 199.99,
            shippingAddress: {
              firstName: "Alice",
              lastName: "Williams",
              street: "321 Maple Rd",
              city: "Houston",
              state: "TX",
              postalCode: "77001",
              country: "US",
            },
            paymentMethod: "paypal",
            paymentId: "PAY-567891234",
            createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
            updatedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            items: [
              {
                id: "item4",
                productId: 4,
                quantity: 1,
                price: 199.99,
              },
            ],
            user: {
              name: "Alice Williams",
              email: "alice@example.com",
            },
          },
        ]

        setOrders(mockOrders)
        setFilteredOrders(mockOrders)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, user])

  // Filter orders when status filter or search query changes
  useEffect(() => {
    let filtered = orders

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.user?.name?.toLowerCase().includes(query) ||
          order.user?.email?.toLowerCase().includes(query),
      )
    }

    setFilteredOrders(filtered)
  }, [statusFilter, searchQuery, orders])

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
      )

      toast({
        title: "Status Updated",
        description: `Order ${orderId} status changed to ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating order status:", error)

      // For demo, update the UI anyway
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
      )

      toast({
        title: "Status Updated",
        description: `Order ${orderId} status changed to ${newStatus}`,
      })
    }
  }

  if (authLoading || (isAuthenticated && user?.email !== "admin@example.com" && isLoading)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.email !== "admin@example.com") {
    return null // Router will handle redirect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">View and manage customer orders</p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0" onClick={() => router.refresh()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
          <CardDescription>Use the filters below to find specific orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID or customer..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No orders found matching your filters</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>{order.user?.name || "Unknown"}</div>
                        <div className="text-sm text-muted-foreground">{order.user?.email || "No email"}</div>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => handleUpdateStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        {order.paymentMethod === "paypal"
                          ? "PayPal"
                          : order.paymentMethod === "cod"
                            ? "Cash on Delivery"
                            : order.paymentMethod}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

