import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { invoiceId: string } }) {
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

    // Get the order
    const order = await db.getOrderById(payload.userId, params.invoiceId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // In a real app, you would generate a PDF invoice here
    // For now, we'll just return the order data as JSON

    // Create a simple invoice object
    const invoice = {
      invoiceNumber: `INV-${params.invoiceId}`,
      orderNumber: order.id,
      date: new Date(order.createdAt).toLocaleDateString(),
      customerName: "Customer Name", // You would get this from the user data
      customerEmail: "customer@example.com", // You would get this from the user data
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      subtotal: order.total,
      tax: 0, // You would calculate this based on your tax rules
      shipping: 0, // You would get this from the order data
      total: order.total,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
    }

    return NextResponse.json({ invoice })
  } catch (error) {
    console.error("Error generating invoice:", error)
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
  }
}

