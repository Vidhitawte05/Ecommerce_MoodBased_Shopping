import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get orders for the authenticated user
    const orders = await prisma.order.findMany({
      where: {
        userId: payload.userId,
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

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get the order data from the request
    const orderData = await request.json()

    // Validate the order data
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json({ error: "Invalid order items" }, { status: 400 })
    }

    if (!orderData.shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
    }

    if (!orderData.paymentMethod) {
      return NextResponse.json({ error: "Payment method is required" }, { status: 400 })
    }

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        userId: payload.userId,
        total: orderData.total,
        status: "pending",
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        paymentId: orderData.paymentId || null,
        items: {
          create: orderData.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

