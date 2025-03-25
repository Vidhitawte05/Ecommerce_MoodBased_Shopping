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

    // Get orders for the current user only
    const orders = await prisma.order.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items, total, shippingAddress, paymentMethod, paymentId } = body

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 })
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        total: total || 0,
        status: "pending",
        shippingAddress: shippingAddress || {},
        paymentMethod: paymentMethod || "unknown",
        paymentId: paymentId || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || item.id,
            quantity: item.quantity || 1,
            price: item.price || 0,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

