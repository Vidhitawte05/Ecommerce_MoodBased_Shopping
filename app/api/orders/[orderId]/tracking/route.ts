import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

// Mock tracking data store
const trackingData: Record<string, any> = {}

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

    // Check if we have tracking data for this order
    if (!trackingData[orderId]) {
      // Generate mock tracking data
      const orderDate = new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)

      const carriers = ["FedEx", "UPS", "DHL", "USPS"]
      const carrier = carriers[Math.floor(Math.random() * carriers.length)]

      const trackingNumber = `${carrier.substring(0, 2).toUpperCase()}${Math.floor(10000000000 + Math.random() * 90000000000)}`

      const estimatedDelivery = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000)

      const status = Math.random() > 0.5 ? "shipped" : "delivered"

      const trackingHistory = [
        {
          status: "Order Placed",
          location: "Online",
          timestamp: orderDate.toISOString(),
        },
        {
          status: "Processing",
          location: "Warehouse",
          timestamp: new Date(orderDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]

      if (status === "shipped" || status === "delivered") {
        trackingHistory.push({
          status: "Shipped",
          location: "Distribution Center",
          timestamp: new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        })
      }

      if (status === "delivered") {
        trackingHistory.push({
          status: "Delivered",
          location: "Customer Address",
          timestamp: new Date(orderDate.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        })
      }

      trackingData[orderId] = {
        orderId,
        carrier,
        trackingNumber,
        estimatedDelivery: estimatedDelivery.toISOString(),
        status,
        trackingHistory,
      }
    }

    return NextResponse.json({ tracking: trackingData[orderId] })
  } catch (error) {
    console.error("Error fetching tracking data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

