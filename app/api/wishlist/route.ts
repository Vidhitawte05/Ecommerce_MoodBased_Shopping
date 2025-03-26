import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Get user from token
    const user = getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Fetching wishlist for user:", user.userId)

    // Get wishlist for the current user only
    let wishlist = await prisma.wishlist.findFirst({
      where: {
        userId: user.userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // If no wishlist exists, create one
    if (!wishlist) {
      console.log("No wishlist found, creating one for user:", user.userId)
      wishlist = await prisma.wishlist.create({
        data: {
          userId: user.userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
    }

    console.log(`Wishlist found with ${wishlist.items.length} items`)

    return NextResponse.json({ wishlist })
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    console.log("Adding product to wishlist for user:", user.userId, "Product:", productId)

    // Get or create wishlist for the current user
    let wishlist = await prisma.wishlist.findFirst({
      where: {
        userId: user.userId,
      },
    })

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          userId: user.userId,
        },
      })
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId: Number(productId),
      },
    })

    if (existingItem) {
      console.log("Product already in wishlist")
      return NextResponse.json({
        success: false,
        message: "Product already in wishlist",
      })
    }

    // Add item to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: Number(productId),
      },
    })

    console.log("Product added to wishlist successfully")

    return NextResponse.json({
      success: true,
      message: "Product added to wishlist",
      wishlistItem,
    })
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const productId = url.searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    console.log("Removing product from wishlist for user:", user.userId, "Product:", productId)

    // Get wishlist for the current user
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        userId: user.userId,
      },
    })

    if (!wishlist) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 })
    }

    // Delete the wishlist item
    await prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId: Number(productId),
      },
    })

    console.log("Product removed from wishlist successfully")

    return NextResponse.json({
      success: true,
      message: "Product removed from wishlist",
    })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
  }
}

