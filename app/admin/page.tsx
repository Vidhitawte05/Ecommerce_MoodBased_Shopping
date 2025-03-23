"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { PlusCircle, Users, ShoppingBag, Package, Mail, Settings } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Admin check - in a real app, you'd check for admin role
  const isAdmin = isAuthenticated && user?.email === "admin@example.com"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/signin?redirect=/admin")
      } else if (!isAdmin) {
        router.push("/")
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router, mounted])

  if (!mounted || isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  if (!isAuthenticated || !isAdmin) {
    return <div className="container mx-auto px-4 py-12 text-center">Access denied. Admin privileges required.</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/products/new">
              <PlusCircle size={16} className="mr-2" />
              Add New Product
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Settings size={16} className="mr-2" />
              View Store
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">432</div>
            <p className="text-xs text-muted-foreground mt-1">+5.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground mt-1">+0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Products
            </CardTitle>
            <CardDescription>Manage your product inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total Products: 25</p>
            <p>Out of Stock: 3</p>
            <p>Low Stock: 5</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/products">Manage Products</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Orders
            </CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p>New Orders: 12</p>
            <p>Processing: 8</p>
            <p>Shipped: 15</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/orders">Manage Orders</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Customers
            </CardTitle>
            <CardDescription>View and manage customer accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Total Customers: 432</p>
            <p>New This Month: 28</p>
            <p>Active: 215</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/admin/customers">Manage Customers</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Latest 5 orders placed on your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Order #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Customer: John Doe</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(Math.random() * 100 + 50).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/admin/orders">View All Orders</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Contact Submissions
            </CardTitle>
            <CardDescription>Recent customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {i === 1 && <span className="w-2 h-2 bg-primary rounded-full inline-block mr-2"></span>}
                      {
                        ["Product Question", "Shipping Inquiry", "Return Request", "Order Status", "General Question"][
                          i - 1
                        ]
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">From: Customer {i}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {i === 1 ? "Just now" : `${i} day${i > 1 ? "s" : ""} ago`}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/admin/contact">View All Messages</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

