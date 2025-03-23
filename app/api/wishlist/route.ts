import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

// Helper functions to get and save wishlist database
const getWishlistDb = () => {
  if (typeof window !== "undefined") {
    try {
      const savedWishlist = localStorage.getItem("persistentWishlistDb")
      if (savedWishlist) {
        return JSON.parse(savedWishlist)
      }
    } catch (error) {
      console.error("Error loading wishlist from storage:", error)
    }
  }
  return {}
}

const saveWishlistDb = (wishlistDb: any) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("persistentWishlistDb", JSON.stringify(wishlistDb))
    } catch (error) {
      console.error("Error saving wishlist to storage:", error)
    }
  }
}

// Mock products for wishlist items
const mockProducts = [
  {
    id: 1,
    name: "Idea Journal",
    price: 19.99,
    images: ["/placeholder.svg?height=200&width=200"],
  },
  {
    id: 2,
    name: "Meditation Cushion",
    price: 49.99,
    images: ["/placeholder.svg?height=200&width=200"],
  },
  {
    id: 3,
    name: "Aromatherapy Diffuser",
    price: 39.99,
    images: ["/placeholder.svg?height=200&width=200"],
  },
  {
    id: 4,
    name: "Weighted Blanket",
    price: 89.99,
    images: ["/placeholder.svg?height=200&width=200"],
  },
]

export async function GET(request: Request) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = payload.userId

    // Get the latest wishlist database
    const wishlistDb = getWishlistDb()

    // If user doesn't have a wishlist, create a mock one
    if (!wishlistDb[userId]) {
      const mockWishlist = {
        userId,
        items: [{ product: mockProducts[0] }, { product: mockProducts[2] }],
      }

      wishlistDb[userId] = mockWishlist
      saveWishlistDb(wishlistDb)

      return NextResponse.json({ wishlist: mockWishlist })
    }

    return NextResponse.json({ wishlist: wishlistDb[userId] })
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Get the latest wishlist database
    const wishlistDb = getWishlistDb()

    // Initialize user's wishlist if it doesn't exist
    if (!wishlistDb[payload.userId]) {
      wishlistDb[payload.userId] = {
        userId: payload.userId,
        items: [],
      }
    }

    // Check if product is already in wishlist
    const existingItem = wishlistDb[payload.userId].items.find((item: any) => item.product.id === productId)

    if (existingItem) {
      return NextResponse.json({
        success: false,
        message: "Product already in wishlist",
      })
    }

    // Find the product in our mock database
    const product = mockProducts.find((p) => p.id === productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Add to wishlist
    wishlistDb[payload.userId].items.push({
      product,
    })

    // Save the updated wishlist
    saveWishlistDb(wishlistDb)

    return NextResponse.json({
      success: true,
      message: "Product added to wishlist",
      wishlist: wishlistDb[payload.userId],
    })
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

