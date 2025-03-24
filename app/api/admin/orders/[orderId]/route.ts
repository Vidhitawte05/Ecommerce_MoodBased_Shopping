import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)

    if (!payload || !payload.userId || payload.email !== "admin@example.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: {
        id: params.orderId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error fetching admin order:", error)
    return NextResponse.json({ error: "Failed to fetch admin order" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)

    if (!payload || !payload.userId || payload.email !== "admin@example.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the update data from the request
    const updateData = await request.json()

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        status: updateData.status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    console.error("Error updating admin order:", error)
    return NextResponse.json({ error: "Failed to update admin order" }, { status: 500 })
  }
}

