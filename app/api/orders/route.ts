import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

// Mock database for orders - we'll make it persist across sessions
const getOrderDb = () => {
  if (typeof window !== "undefined") {
    try {
      const savedOrders = localStorage.getItem("persistentOrderDb")
      if (savedOrders) {
        return JSON.parse(savedOrders)
      }
    } catch (error) {
      console.error("Error loading orders from storage:", error)
    }
  }
  return {}
}

// Initialize with saved data or empty object
let orderDb = getOrderDb()
let orderIdCounter = 1000

// Helper to save orders to localStorage
const saveOrderDb = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("persistentOrderDb", JSON.stringify(orderDb))
    } catch (error) {
      console.error("Error saving orders to storage:", error)
    }
  }
}

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

    // Get the user's orders
    const userId = payload.userId

    // Refresh from localStorage in case it was updated in another tab
    orderDb = getOrderDb()

    // Return mock orders if none exist
    if (!orderDb[userId] || Object.keys(orderDb[userId]).length === 0) {
      const mockOrders = [
        {
          id: "ORD-123456",
          userId: userId,
          status: "delivered",
          total: 99.98,
          createdAt: new Date().toISOString(),
          items: [
            {
              id: "item1",
              productId: 1,
              quantity: 1,
              price: 19.99,
              product: {
                id: 1,
                name: "Idea Journal",
                images: ["/placeholder.svg?height=300&width=300"],
              },
            },
            {
              id: "item2",
              productId: 3,
              quantity: 1,
              price: 39.99,
              product: {
                id: 3,
                name: "Aromatherapy Diffuser",
                images: ["/placeholder.svg?height=300&width=300"],
              },
            },
          ],
        },
      ]

      // Save mock orders to the database for persistence
      orderDb[userId] = {}
      mockOrders.forEach((order) => {
        orderDb[userId][order.id] = order
      })
      saveOrderDb()

      return NextResponse.json({ orders: mockOrders })
    }

    return NextResponse.json({ orders: Object.values(orderDb[userId] || {}) })
  } catch (error) {
    console.error("Error fetching orders:", error)
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
    const { items, shippingAddress, billingAddress, paymentMethod, total, paymentId } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 })
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: "Payment method is required" }, { status: 400 })
    }

    // Refresh from localStorage in case it was updated in another tab
    orderDb = getOrderDb()

    // Generate a unique order ID
    const orderId = `ORD-${orderIdCounter++}`

    // Initialize user's orders if they don't exist
    if (!orderDb[payload.userId]) {
      orderDb[payload.userId] = {}
    }

    // Create order items with mock product data
    const orderItems = items.map((item: any, index: number) => ({
      id: `item-${orderId}-${index}`,
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      product: {
        id: item.id,
        name: item.name || `Product ${item.id}`,
        images: [item.image || "/placeholder.svg?height=300&width=300"],
      },
    }))

    // Create the order
    const order = {
      id: orderId,
      userId: payload.userId,
      total: total || 0,
      status: "pending",
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentId,
      items: orderItems,
      createdAt: new Date().toISOString(),
      trackingInfo: {
        carrier: "FedEx",
        trackingNumber: `FX${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        trackingHistory: [
          {
            status: "Order Placed",
            location: "Online",
            timestamp: new Date().toISOString(),
          },
        ],
      },
    }

    // Store the order
    orderDb[payload.userId][orderId] = order

    // Save to localStorage for persistence
    saveOrderDb()

    // Create a notification for the order
    const notification = {
      type: "order",
      title: "Order Placed",
      message: `Your order #${orderId} has been placed successfully.`,
      link: `/account/orders/${orderId}`,
    }

    return NextResponse.json({
      order,
      notification,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

