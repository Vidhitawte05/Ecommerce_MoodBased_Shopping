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

    // Get wishlist for the current user
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

    // Get or create wishlist
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
      return NextResponse.json({ error: "Product already in wishlist" }, { status: 400 })
    }

    // Add item to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: Number(productId),
      },
    })

    return NextResponse.json({ wishlistItem })
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}

