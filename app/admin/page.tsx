"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { Users, ShoppingBag, DollarSign, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalContacts: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/admin")
      return
    }

    // For demo purposes, we'll consider a specific email as admin
    // In a real app, you would have a proper role-based system
    if (!authLoading && isAuthenticated && user?.email !== "admin@example.com") {
      router.push("/")
    }
  }, [authLoading, isAuthenticated, user, router])

  // Fetch admin dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated || user?.email !== "admin@example.com") return

      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")

        const response = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch admin stats")
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching admin stats:", error)
        // Use mock data for demo
        setStats({
          totalUsers: 24,
          totalOrders: 156,
          totalRevenue: 12589.99,
          totalContacts: 18,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated, user])

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
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Requests</p>
                <p className="text-3xl font-bold">{stats.totalContacts}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="contacts">Contact Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Access important admin functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/users" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <Users className="h-6 w-6 mb-2" />
                  <h3 className="font-medium">Manage Users</h3>
                </Link>
                <Link href="/admin/orders" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <ShoppingBag className="h-6 w-6 mb-2" />
                  <h3 className="font-medium">Manage Orders</h3>
                </Link>
                <Link href="/admin/products" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <DollarSign className="h-6 w-6 mb-2" />
                  <h3 className="font-medium">Manage Products</h3>
                </Link>
                <Link href="/admin/contact" className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <h3 className="font-medium">Contact Requests</h3>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm">New order placed</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm">New user registered</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="text-sm">Product stock updated</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <p className="text-sm">Contact form submission</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">
                <Link href="/admin/users" className="text-primary hover:underline">
                  Go to Users Management
                </Link>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders Management</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">
                <Link href="/admin/orders" className="text-primary hover:underline">
                  Go to Orders Management
                </Link>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products Management</CardTitle>
              <CardDescription>View and manage product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">
                <Link href="/admin/products" className="text-primary hover:underline">
                  Go to Products Management
                </Link>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contact Requests</CardTitle>
              <CardDescription>View and respond to customer inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">
                <Link href="/admin/contact" className="text-primary hover:underline">
                  Go to Contact Requests
                </Link>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

