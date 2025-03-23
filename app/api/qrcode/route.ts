import { NextResponse } from "next/server"
import QRCode from "qrcode"
import { getAppUrl, debugEnv } from "@/lib/env"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    let { paymentUrl, size = 200 } = body

    if (!paymentUrl) {
      return NextResponse.json({ error: "Payment URL is required" }, { status: 400 })
    }

    // Debug environment variables
    const envInfo = debugEnv()
    console.log("Environment info:", envInfo)
    console.log("Original payment URL:", paymentUrl)

    // Get the app URL
    const appUrl = getAppUrl()
    console.log("App URL:", appUrl)

    // If the payment URL is relative, make it absolute
    if (paymentUrl.startsWith("/")) {
      paymentUrl = `${appUrl}${paymentUrl}`
      console.log("Converted relative URL to absolute:", paymentUrl)
    }
    // If the payment URL contains localhost or 127.0.0.1, replace with app URL
    else if (paymentUrl.includes("localhost") || paymentUrl.includes("127.0.0.1")) {
      try {
        const localUrl = new URL(paymentUrl)
        const path = localUrl.pathname + localUrl.search
        const newUrl = new URL(path, appUrl)
        paymentUrl = newUrl.toString()
        console.log("Replaced localhost URL with:", paymentUrl)
      } catch (error) {
        console.error("Error parsing URL:", error)
      }
    }

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl, {
      width: size,
      margin: 2,
      color: {
        dark: "#7c3aed", // Primary color
        light: "#FFFFFF",
      },
    })

    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      paymentUrl: paymentUrl, // Return the actual URL used for debugging
      environment: envInfo,
    })
  } catch (error) {
    console.error("QR code generation error:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}

