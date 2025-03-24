import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export function middleware(request: NextRequest) {
  // Check if the request is for an API route that requires authentication
  if (
    request.nextUrl.pathname.startsWith("/api/protected") ||
    request.nextUrl.pathname.startsWith("/api/admin") ||
    request.nextUrl.pathname.startsWith("/api/orders") ||
    request.nextUrl.pathname.startsWith("/api/wishlist") ||
    request.nextUrl.pathname.startsWith("/api/payment-methods")
  ) {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // For admin routes, check if the user is an admin
    if (request.nextUrl.pathname.startsWith("/api/admin") && payload.email !== "admin@example.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
  }

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/protected/:path*",
    "/api/admin/:path*",
    "/api/orders/:path*",
    "/api/wishlist/:path*",
    "/api/payment-methods/:path*",
  ],
}

