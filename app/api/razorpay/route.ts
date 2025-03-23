import { NextResponse } from "next/server"
import crypto from "crypto"

// Razorpay test credentials
const RAZORPAY_KEY_ID = "rzp_test_YourTestKeyId" // Replace with your test key
const RAZORPAY_KEY_SECRET = "YourTestKeySecret" // Replace with your test secret

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, currency = "INR", receipt = `receipt_${Date.now()}` } = body

    // Create a mock Razorpay order (in a real app, you would use the Razorpay SDK)
    const orderData = {
      amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency unit (paise)
      currency,
      receipt,
      payment_capture: 1,
    }

    // Generate a unique order ID
    const orderId = `order_${crypto.randomBytes(8).toString("hex")}`

    // Create a mock response that mimics Razorpay's response
    const mockResponse = {
      id: orderId,
      entity: "order",
      amount: orderData.amount,
      amount_paid: 0,
      amount_due: orderData.amount,
      currency: orderData.currency,
      receipt: orderData.receipt,
      status: "created",
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000),
    }

    return NextResponse.json({
      success: true,
      order: mockResponse,
      key_id: RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error("Razorpay error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

