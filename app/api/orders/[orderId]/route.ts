import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

const brevity = undefined
const it = undefined
const is = undefined
const correct = undefined
const and = undefined

// Helper functions to get and save order database
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

const saveOrderDb = (orderDb: any) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("persistentOrderDb", JSON.stringify(orderDb))
    } catch (error) {
      console.error("Error saving orders to storage:", error)
    }
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    const orderId = params.id
    const userId = payload.userId

    // Get the latest order database
    const orderDb = getOrderDb()

    // Check if the user has orders
    if (!orderDb[userId] || !orderDb[userId][orderId]) {
      // Create a mock order for demo purposes
      const mockOrder = {
        id: orderId,
        userId: userId,
        status: "processing",
        total: 99.98,
        shippingAddress: {
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "US",
          email: "john.doe@example.com",
          phone: "555-123-4567",
        },
        billingAddress: {
          firstName: "John",
          lastName: "Doe",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "US",
        },
        paymentMethod: "paypal",
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
            quantity: 2,
            price: 39.99,
            product: {
              id: 3,
              name: "Aromatherapy Diffuser",
              images: ["/placeholder.svg?height=300&width=300"],
            },
          },
        ],
        trackingInfo: {
          carrier: "FedEx",
          trackingNumber: "FX" + Math.floor(1000000000 + Math.random() * 9000000000),
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          trackingHistory: [
            {
              status: "Order Placed",
              location: "Online",
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              status: "Processing",
              location: "Warehouse",
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
        },
      }

      // Store the mock order for future requests
      if (!orderDb[userId]) {
        orderDb[userId] = {}
      }
      orderDb[userId][orderId] = mockOrder
      saveOrderDb(orderDb)

      return NextResponse.json({ order: mockOrder })
    }

    // Return the actual order if it exists
    return NextResponse.json({ order: orderDb[userId][orderId] })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const orderId = params.id
    const userId = payload.userId
    const body = await request.json()

    // Get the latest order database
    const orderDb = getOrderDb()

    // Check if the user has orders and the order exists
    if (!orderDb[userId] || !orderDb[userId][orderId]) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update the order
    orderDb[userId][orderId] = {
      ...orderDb[userId][orderId],
      ...body,
    }

    // Save the updated order database
    saveOrderDb(orderDb)

    return NextResponse.json({ order: orderDb[userId][orderId] })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

