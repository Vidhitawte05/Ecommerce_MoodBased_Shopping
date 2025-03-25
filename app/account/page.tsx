"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function AccountPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin?callbackUrl=/account")
    }

    // Fetch user orders if authenticated
    if (isAuthenticated) {
      fetchUserOrders()
    }
  }, [isAuthenticated, isLoading, router])

  const fetchUserOrders = async () => {
    try {
      setIsLoadingOrders(true)
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication token not found")
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
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load your orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingOrders(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user?.name || "Not available"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || "Not available"}</p>
              </div>
              <Separator className="my-4" />
              <Button asChild variant="outline" className="w-full">
                <Link href="/account/settings">Edit Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Dashboard</CardTitle>
            <CardDescription>Manage your account and view your orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recent Orders</h3>

                  {isLoadingOrders ? (
                    <p>Loading orders...</p>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order: any) => (
                        <div key={order.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${order.total?.toFixed(2) || "0.00"}</p>
                              <p className="text-sm capitalize">{order.status}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button asChild variant="outline" className="w-full">
                        <Link href="/account/orders">View All Orders</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                      <Button asChild>
                        <Link href="/products">Browse Products</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="wishlist">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Your Wishlist</h3>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/account/wishlist">View Wishlist</Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button asChild variant="outline">
                      <Link href="/account/settings">Edit Profile</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/account/payment-methods">Payment Methods</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/account/notifications">Notification Settings</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

