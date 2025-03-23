import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function DELETE(request: Request, { params }: { params: { productId: string } }) {
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

    const productId = Number.parseInt(params.productId)

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const userId = payload.userId

    // First, find the user's wishlist
    const wishlist = await prisma.wishlist.findFirst({
      where: { userId },
    })

    if (!wishlist) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 })
    }

    // Find and delete the wishlist item
    const deletedItem = await prisma.wishlistItem.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    })

    if (deletedItem.count === 0) {
      return NextResponse.json({ error: "Item not found in wishlist" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Item removed from wishlist",
    })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

