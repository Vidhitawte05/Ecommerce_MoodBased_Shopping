import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, shippingAddress, paymentMethod, userId } = body

    // Validate the request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 })
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: "Payment method is required" }, { status: 400 })
    }

    // Calculate the total
    let total = 0
    for (const item of items) {
      const product = await db.getProductById(item.productId)
      if (!product) {
        return NextResponse.json({ error: `Product with ID ${item.productId} not found` }, { status: 400 })
      }
      total += product.price * item.quantity
    }

    // Add shipping cost if total is less than $35
    if (total < 35) {
      total += 5.99
    }

    // Add tax (8%)
    total += total * 0.08

    // Create the order
    const order = await db.createOrder({
      userId,
      items,
      total,
      status: "pending",
      shippingAddress,
      paymentMethod,
    })

    // In a real app, you would integrate with Razorpay or PayPal here
    // For this example, we'll just return the order

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      },
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

