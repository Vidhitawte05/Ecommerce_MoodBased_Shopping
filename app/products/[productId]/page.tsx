"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Heart, Minus, Plus, ShoppingCart, Star, Truck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

type ProductType = {
  id: number;
  name: string;
  price: number;
  images: string[];
  description: string;
  details: {
    material: string;
    dimensions: string;
    pages: string;
    features: string;
  };
  moods: string[];
  rating: number;
  reviews: number;
  stock: number;
  shipping: string;
};

// Mock product data for fallback
const mockProducts: Record<string, ProductType> = {
  "1": {
    id: 1,
    name: "Idea Journal",
    price: 19.99,
    images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    description:
      "Unlock your creativity with this beautifully designed idea journal. Perfect for brainstorming, sketching, and capturing your thoughts.",
    details: {
      material: "Recycled paper, vegan leather cover",
      dimensions: "8.5 x 11 inches",
      pages: "120 pages",
      features: "Lay-flat binding, pocket folder, elastic closure",
    },
    moods: ["Creative", "Curious", "Open"],
    rating: 4.5,
    reviews: 128,
    stock: 15,
    shipping: "Free shipping on orders over $35",
  },
  // Other products...
}

export default function ProductPage({ params }: { params: { productId: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Add this state for selected payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("paypal")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)

        // Try to fetch from API first - use productId parameter
        const response = await fetch(`/api/products/${params.productId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch product")
        }

        const data = await response.json()

        if (data.product) {
          setProduct(data.product)
        } else {
          // If API doesn't return a product, check our mock data
          if (mockProducts[params.productId]) {
            setProduct(mockProducts[params.productId])
          } else {
            // Create a generic product if not found
            setProduct({
              id: Number(params.productId),
              name: `Product ${params.productId}`,
              price: 29.99,
              images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
              description: "This is a product description.",
              details: {
                material: "High-quality materials",
                dimensions: "Standard size",
                features: "Multiple features",
              },
              moods: ["Creative", "Serene"],
              rating: 4.5,
              reviews: 10,
              stock: 20,
              shipping: "Free shipping on orders over $35",
            })
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err)

        // Fallback to mock data
        if (mockProducts[String(params.productId)]) {
  setProduct(mockProducts[String(params.productId)]);
}else {
          // Create a generic product if not found
          setProduct({
            id: Number(params.productId),
            name: `Product ${params.productId}`,
            price: 29.99,
            images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
            description: "This is a product description.",
            details: {
              material: "High-quality materials",
              dimensions: "Standard size",
              features: "Multiple features",
            },
            moods: ["Creative", "Serene"],
            rating: 4.5,
            reviews: 10,
            stock: 20,
            shipping: "Free shipping on orders over $35",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.productId])

  // Check if product is in wishlist
  useEffect(() => {
    if (isAuthenticated && product) {
      checkWishlistStatus()
    }
  }, [isAuthenticated, product])

  const checkWishlistStatus = async () => {
    if (!product) return

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist")
      }

      const data = await response.json()

      // Check if the product is in the wishlist
      const isInWishlist = data.wishlist.items.some((item: any) => item.product.id === product.id)

      setIsWishlisted(isInWishlist)
    } catch (error) {
      console.error("Error checking wishlist status:", error)
    }
  }

  // Helper function to get image with proper path
  const getImagePath = (imagePath: string) => {
    // If the image is a relative path and doesn't start with http, make it absolute
    if (imagePath && !imagePath.startsWith("http") && !imagePath.startsWith("/placeholder")) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""
      return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
    }
    return imagePath
  }

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: getImagePath(product.images[0]),
    })

    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    })
  }

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist.",
        variant: "destructive",
      })
      router.push("/auth/signin?redirect=/products")
      return
    }

    if (!product) return

    try {
      setIsWishlisted(!isWishlisted) // Optimistically update UI

      const token = localStorage.getItem("token")
      if (!token) return

      if (isWishlisted) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist/${product.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          setIsWishlisted(true) // Revert if failed
          throw new Error("Failed to remove from wishlist")
        }

        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        })
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id }),
        })

        if (!response.ok) {
          setIsWishlisted(false) // Revert if failed
          const data = await response.json()
          if (data.error && data.error.includes("already in wishlist")) {
            setIsWishlisted(true)
            return
          }
          throw new Error("Failed to add to wishlist")
        }

        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
        })
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleBuyNow = () => {
    if (!product) return

    // Add the product to cart
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: getImagePath(product.images[0]),
    })

    // Show toast notification
    toast({
      title: "Product added to cart",
      description: `${product.name} has been added to your cart.`,
    })

    // Redirect to checkout with payment method in query params
    router.push(`/checkout?payment=${selectedPaymentMethod}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find the product you're looking for.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2 space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={getImagePath(product.images[selectedImage]) || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex gap-4">
            {product.images.map((image: string, index: number) => (
              <div
                key={`thumb-${index}`}
                className={`relative aspect-square w-20 rounded-md overflow-hidden border cursor-pointer ${selectedImage === index ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={getImagePath(image) || "/placeholder.svg"}
                  alt={`${product.name} - view ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={`rating-star-${i}`}
                    size={18}
                    className={i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
              </div>
            </div>
            <div className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</div>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="flex items-center gap-2 mb-2">
              <div className="text-sm font-medium">Mood:</div>
              <div className="flex gap-2">
                {product.moods.map((mood: string) => (
                  <Link
                    key={`mood-${mood}`}
                    href={`/mood/${mood.toLowerCase()}`}
                    className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20"
                  >
                    {mood}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <Truck size={16} className="mr-2" />
              {product.shipping}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                  <Minus size={16} />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                  className="w-16 text-center border-0"
                />
                <Button variant="ghost" size="icon" onClick={increaseQuantity} disabled={quantity >= product.stock}>
                  <Plus size={16} />
                </Button>
              </div>

              <Button className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </Button>

              <Button variant="outline" size="icon" onClick={handleToggleWishlist}>
                <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              </Button>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={handleBuyNow}>
                Buy Now
              </Button>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment options" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="cod">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-6 border rounded-b-lg">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Materials</h3>
                <p>{product.details.material}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Dimensions</h3>
                <p>{product.details.dimensions}</p>
              </div>
              {product.details.pages && (
                <div>
                  <h3 className="font-semibold mb-2">Pages</h3>
                  <p>{product.details.pages}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <p>{product.details.features}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-6 border rounded-b-lg">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
              <p className="text-muted-foreground mb-4">
                This product has {product.reviews} reviews with an average rating of {product.rating} stars.
              </p>
              <Button>Write a Review</Button>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="p-6 border rounded-b-lg">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Shipping</h3>
                <p>
                  Orders are typically processed within 1-2 business days. Standard shipping takes 3-5 business days.
                </p>
                <p className="mt-2">{product.shipping}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Returns</h3>
                <p>We accept returns within 30 days of delivery. Items must be unused and in original packaging.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

