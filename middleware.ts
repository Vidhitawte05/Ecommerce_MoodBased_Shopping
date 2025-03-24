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
    pathname.startsWith("/api/auth/signin") ||
    pathname.startsWith("/api/auth/signup") ||
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/moods")
  ) {
    return NextResponse.next()
  }

  // Check if the path requires authentication
  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path))
  const requiresAdmin = adminPaths.some((path) => pathname.startsWith(path))

  // Get the token from the cookies
  const token = request.cookies.get("auth_token")?.value

  // If no token and the path requires authentication, redirect to login
  if (requiresAuth && !token) {
    const url = new URL("/auth/signin", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // If there is a token, verify it
  if (token) {
    const payload = verifyToken(token)

    // If the token is invalid, clear it and redirect to login if the path requires authentication
    if (!payload && requiresAuth) {
      const response = NextResponse.redirect(new URL("/auth/signin", request.url))
      response.cookies.set("auth_token", "", { maxAge: 0 })
      return response
    }

    // If the path requires admin access, check if the user is an admin
    if (requiresAdmin && payload?.email !== "admin@example.com") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // If the token is valid, add the user ID to the headers for API routes
    if (payload && pathname.startsWith("/api")) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("X-User-ID", payload.userId)

      // For admin routes, also verify admin status
      if (pathname.startsWith("/api/admin") && payload.email !== "admin@example.com") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }

  return NextResponse.next()
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

