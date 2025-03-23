import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { orderId: string } }) {
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

    const orderId = params.orderId

    // Get the order from the database
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: payload.userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // In a real app, you would generate a PDF invoice here
    // For this example, we'll just return the order data

    return NextResponse.json({
      success: true,
      invoice: {
        orderId: order.id,
        date: order.createdAt,
        customerName: order.user.name,
        customerEmail: order.user.email,
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
        total: order.total,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
      },
    })
  } catch (error) {
    console.error("Invoice error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

