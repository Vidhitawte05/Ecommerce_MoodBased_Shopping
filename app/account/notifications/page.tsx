"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, ShoppingBag, Tag, Info, ArrowLeft } from "lucide-react"
import Link from "next/link"

type Notification = {
  id: string
  type: "order" | "sale" | "system"
  title: string
  message: string
  date: string
  read: boolean
  link?: string
}

export default function NotificationsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/account/notifications")
    }
  }, [isLoading, isAuthenticated, router, mounted])

  // Generate mock notifications
  useEffect(() => {
    if (isAuthenticated) {
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "order",
          title: "Order Confirmed",
          message: "Your order #ORD-1234 has been confirmed and is being processed.",
          date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          read: false,
          link: "/account/orders/ORD-1234",
        },
        {
          id: "2",
          type: "order",
          title: "Order Shipped",
          message: "Your order #ORD-1122 has been shipped. Track your package now.",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: false,
          link: "/account/orders/ORD-1122",
        },
        {
          id: "3",
          type: "sale",
          title: "Summer Sale",
          message: "Enjoy 20% off on all summer products. Use code SUMMER20.",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: "/products",
        },
        {
          id: "4",
          type: "system",
          title: "Account Update",
          message: "Your account information has been updated successfully.",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: "/account/settings",
        },
        {
          id: "5",
          type: "sale",
          title: "New Arrivals",
          message: "Check out our new collection of mood-enhancing products.",
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: "/products",
        },
        {
          id: "6",
          type: "order",
          title: "Order Delivered",
          message: "Your order #ORD-1001 has been delivered. Enjoy your products!",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: "/account/orders/ORD-1001",
        },
        {
          id: "7",
          type: "system",
          title: "Password Changed",
          message: "Your account password has been changed successfully.",
          date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: "/account/settings",
        },
        {
          id: "8",
          type: "sale",
          title: "Flash Sale",
          message: "24-hour flash sale! 30% off on selected items.",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          link: "/products",
        },
      ]

      setNotifications(mockNotifications)
    }
  }, [isAuthenticated])

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag size={16} className="text-blue-500" />
      case "sale":
        return <Tag size={16} className="text-green-500" />
      case "system":
        return <Info size={16} className="text-orange-500" />
      default:
        return <Bell size={16} className="text-primary" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!mounted || isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <div className="container mx-auto px-4 py-12 text-center">Please sign in to view your notifications.</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/account">
            <ArrowLeft size={16} className="mr-2" />
            Back to Account
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Notifications</CardTitle>
            <CardDescription>Stay updated with your orders, sales, and account activity</CardDescription>
          </div>
          {notifications.some((n) => !n.read) && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg hover:bg-muted/50 cursor-pointer ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
                      onClick={() => {
                        markAsRead(notification.id)
                        if (notification.link) {
                          router.push(notification.link)
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{notification.title}</h4>
                            {!notification.read && (
                              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                                New
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground">You don't have any notifications yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders">
              {notifications.filter((n) => n.type === "order").length > 0 ? (
                <div className="space-y-4">
                  {notifications
                    .filter((n) => n.type === "order")
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg hover:bg-muted/50 cursor-pointer ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
                        onClick={() => {
                          markAsRead(notification.id)
                          if (notification.link) {
                            router.push(notification.link)
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <ShoppingBag size={16} className="text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{notification.title}</h4>
                              {!notification.read && (
                                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                                  New
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No order notifications</h3>
                  <p className="text-muted-foreground">You don't have any order notifications yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sales">
              {notifications.filter((n) => n.type === "sale").length > 0 ? (
                <div className="space-y-4">
                  {notifications
                    .filter((n) => n.type === "sale")
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg hover:bg-muted/50 cursor-pointer ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
                        onClick={() => {
                          markAsRead(notification.id)
                          if (notification.link) {
                            router.push(notification.link)
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <Tag size={16} className="text-green-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{notification.title}</h4>
                              {!notification.read && (
                                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                                  New
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Tag size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No sale notifications</h3>
                  <p className="text-muted-foreground">You don't have any sale notifications yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="system">
              {notifications.filter((n) => n.type === "system").length > 0 ? (
                <div className="space-y-4">
                  {notifications
                    .filter((n) => n.type === "system")
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg hover:bg-muted/50 cursor-pointer ${!notification.read ? "bg-primary/5 border-primary/20" : ""}`}
                        onClick={() => {
                          markAsRead(notification.id)
                          if (notification.link) {
                            router.push(notification.link)
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <Info size={16} className="text-orange-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{notification.title}</h4>
                              {!notification.read && (
                                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                                  New
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">{formatDate(notification.date)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Info size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No system notifications</h3>
                  <p className="text-muted-foreground">You don't have any system notifications yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

