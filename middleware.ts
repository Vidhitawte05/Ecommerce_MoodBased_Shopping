import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

// Define which paths require authentication
const protectedPaths = [
  "/account",
  "/checkout",
  "/api/protected",
  "/api/orders",
  "/api/wishlist",
  "/api/payment-methods",
]

// Define which paths are for admin only
const adminPaths = ["/admin", "/api/admin"]

// Define public API paths that don't need to be checked
const publicApiPaths = ["/api/auth/signin", "/api/auth/signup", "/api/products", "/api/moods"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static assets and public API paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    publicApiPaths.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next()
  }

  // Check if the path requires authentication
  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path))
  const requiresAdmin = adminPaths.some((path) => pathname.startsWith(path))

  // If path doesn't require auth, proceed
  if (!requiresAuth && !requiresAdmin) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get("auth_token")?.value

  // If no token and the path requires authentication, redirect to login
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const url = new URL("/auth/signin", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Verify token
  try {
    const payload = verifyToken(token)

    // If token is invalid, redirect to login
    if (!payload) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }
      const response = NextResponse.redirect(new URL("/auth/signin", request.url))
      response.cookies.set("auth_token", "", { maxAge: 0 })
      return response
    }

    // If the path requires admin access, check if the user is an admin
    if (requiresAdmin && payload.email !== "admin@example.com") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      return NextResponse.redirect(new URL("/", request.url))
    }

    // If the token is valid, add the user info to the headers for API routes
    if (pathname.startsWith("/api")) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("X-User-ID", payload.userId)
      requestHeaders.set("X-User-Email", payload.email)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Token verification error:", error)

    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Authentication error" }, { status: 401 })
    }

    const response = NextResponse.redirect(new URL("/auth/signin", request.url))
    response.cookies.set("auth_token", "", { maxAge: 0 })
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

