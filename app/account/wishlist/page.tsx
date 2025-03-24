"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ShoppingCart, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"

type WishlistItem = {
  id: number | string
  name: string
  price: number
  image: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/account/wishlist")
      return
    }

    if (isAuthenticated) {
      fetchWishlist()
    }
  }, [isAuthenticated, authLoading, router])

  const fetchWishlist = async () => {
    try {
      setIsLoading(true)

      // For demo purposes, we'll use localStorage to get wishlist items
      const items = JSON.parse(localStorage.getItem("wishlistItems") || "[]")
      setWishlistItems(items)
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to load your wishlist. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (itemId: string | number) => {
    try {
      // Update local state
      setWishlistItems(wishlistItems.filter((item) => item.id !== itemId))

      // Update localStorage
      const updatedWishlist = wishlistItems.filter((item) => item.id !== itemId)
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist))

      toast({
        title: "Item removed",
        description: "The item has been removed from your wishlist.",
      })
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = (product: WishlistItem) => {
    addToCart({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
        <p className="text-muted-foreground mb-6">Please sign in to view your wishlist.</p>
        <Button asChild>
          <Link href="/auth/signin?redirect=/account/wishlist">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Items you add to your wishlist will appear here.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Link href={`/products/${item.id}`}>
                  <Image
                    src={item.image || "/placeholder.svg?height=300&width=300"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </Link>
              </div>
              <CardContent className="p-4">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-medium mb-2 hover:text-primary">{item.name}</h3>
                </Link>
                <p className="font-semibold mb-4">${item.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <Button variant="default" size="sm" className="flex-1" onClick={() => handleAddToCart(item)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-0 w-9"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

