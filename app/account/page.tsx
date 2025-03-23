"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingBag, Heart, CreditCard, Settings, Bell } from "lucide-react"

export default function AccountPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isLoading, isAuthenticated, router, mounted])

  if (!mounted || isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <div className="container mx-auto px-4 py-12 text-center">Please sign in to view your account.</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <Button variant="outline" asChild className="mt-4">
                <Link href="/account/settings">
                  <Settings size={16} className="mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>Quick overview of your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <ShoppingBag size={20} className="mr-2 text-primary" />
                <span>0 Orders</span>
              </div>
              <div className="flex items-center">
                <Heart size={20} className="mr-2 text-primary" />
                <span>0 Wishlist Items</span>
              </div>
              <div className="flex items-center">
                <CreditCard size={20} className="mr-2 text-primary" />
                <span>0 Saved Payment Methods</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Link href="/account/orders">
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <ShoppingBag size={24} className="text-primary mb-2" />
              <CardTitle>My Orders</CardTitle>
              <CardDescription>View and track your orders</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/account/wishlist">
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <Heart size={24} className="text-primary mb-2" />
              <CardTitle>Wishlist</CardTitle>
              <CardDescription>View and manage your wishlist</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/account/payment-methods">
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <CreditCard size={24} className="text-primary mb-2" />
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/account/notifications">
          <Card className="h-full hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <Bell size={24} className="text-primary mb-2" />
              <CardTitle>Notifications</CardTitle>
              <CardDescription>View your order and sale notifications</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}

