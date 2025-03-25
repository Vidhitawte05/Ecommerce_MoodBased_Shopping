"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/contexts/NotificationContext"

type ProductType = {
  id: number
  name: string
  price: number
  image?: string
  images?: string[]
  rating: number
}

export function ProductCard({ product }: { product: ProductType }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isCheckingWishlist, setIsCheckingWishlist] = useState(true)
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Check if the product is in the user's wishlist
    if (isAuthenticated) {
      checkWishlistStatus()
    } else {
      setIsCheckingWishlist(false)
    }
  }, [isAuthenticated, product.id])

  const checkWishlistStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setIsCheckingWishlist(false)
        return
      }

      // For demo purposes, we'll use localStorage to check wishlist status
      const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]")
      const isInWishlist = wishlistItems.some((item: any) => item.id === product.id)
      setIsWishlisted(isInWishlist)
      setIsCheckingWishlist(false)
    } catch (error) {
      console.error("Error checking wishlist status:", error)
      setIsCheckingWishlist(false)
    }
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: getProductImage(),
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    // Stop event propagation to prevent navigation
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive",
      })
      router.push("/auth/signin?redirect=/products")
      return
    }

    try {
      // Optimistically update UI
      setIsWishlisted(!isWishlisted)

      // For demo purposes, we'll use localStorage to store wishlist items
      const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]")

      if (isWishlisted) {
        // Remove from wishlist
        const updatedWishlist = wishlistItems.filter((item: any) => item.id !== product.id)
        localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist))

        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        })

        // Add notification
        addNotification({
          title: "Item Removed",
          message: `${product.name} has been removed from your wishlist.`,
          type: "info",
        })
      } else {
        // Add to wishlist
        const productToAdd = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: getProductImage(),
        }

        // Check if product is already in wishlist
        if (!wishlistItems.some((item: any) => item.id === product.id)) {
          wishlistItems.push(productToAdd)
          localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems))

          toast({
            title: "Added to wishlist",
            description: `${product.name} has been added to your wishlist.`,
          })

          // Add notification
          addNotification({
            title: "Item Added",
            message: `${product.name} has been added to your wishlist.`,
            type: "success",
          })
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
      // Revert UI state if there was an error
      setIsWishlisted(!isWishlisted)
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    }
  }

  // Helper function to get product image with proper path
  const getProductImage = () => {
    let imagePath =
      product.image ||
      (product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg?height=300&width=300")

    // If the image is a relative path and doesn't start with http, make it absolute
    if (imagePath && !imagePath.startsWith("http") && !imagePath.startsWith("/placeholder")) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""
      imagePath = `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
    }

    return imagePath
  }

  // Get product image
  const productImage = getProductImage()

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={productImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform hover:scale-105"
              unoptimized // Add this to prevent image optimization issues
            />
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 rounded-full z-10"
          onClick={handleToggleWishlist}
          disabled={isCheckingWishlist}
          type="button"
        >
          <Heart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
          <span className="sr-only">Add to wishlist</span>
        </Button>
      </div>

      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base">
          <Link href={`/products/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={`star-${product.id}-${i}`}
              size={16}
              className={i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
            />
          ))}
          <span className="text-sm ml-1 text-muted-foreground">{product.rating}</span>
        </div>
        <div className="font-semibold">${product.price.toFixed(2)}</div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart size={16} className="mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

