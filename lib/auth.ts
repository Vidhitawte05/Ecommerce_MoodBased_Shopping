import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

// Use environment variable for JWT secret with fallback
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface JwtPayload {
  userId: string
  email: string
  name: string
  iat?: number
  exp?: number
}

// Create a secure token
export function createSecureToken(userId: string, email: string, name: string): string {
  return jwt.sign({ userId, email, name }, JWT_SECRET, { expiresIn: "7d" })
}

// Verify token
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

// Get token from various sources
export function getTokenFromRequest(req: Request | NextRequest): string | null {
  try {
    // Try Authorization header
    const authHeader = req.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.substring(7)
    }

    // For NextRequest, try cookies
    if ("cookies" in req) {
      const token = (req as NextRequest).cookies.get("auth_token")?.value
      if (token) {
        return token
      }
    }

    return null
  } catch (error) {
    console.error("Error getting token from request:", error)
    return null
  }
}

// Get current user from request
export function getCurrentUser(req: Request | NextRequest): JwtPayload | null {
  try {
    const token = getTokenFromRequest(req)
    if (!token) return null
    return verifyToken(token)
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Get server-side user
export function getServerSideUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value
    if (!token) return null
    return verifyToken(token)
  } catch (error) {
    console.error("Error getting server-side user:", error)
    return null
  }
}

// Get user ID from token
export function getUserIdFromToken(token: string): string | null {
  try {
    const payload = verifyToken(token)
    return payload?.userId || null
  } catch (error) {
    console.error("Error getting user ID from token:", error)
    return null
  }
}

// Remove auth cookie
export function removeAuthCookie() {
  try {
    const cookieStore = cookies()
    cookieStore.set("auth_token", "", {
      expires: new Date(0),
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    })
    return { success: true }
  } catch (error) {
    console.error("Error removing auth cookie:", error)
    return { success: false, error }
  }
}

