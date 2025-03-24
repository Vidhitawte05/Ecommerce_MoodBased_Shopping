import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

// Use environment variable for JWT secret or fallback to a default (for development only)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface JwtPayload {
  userId: string
  email: string
  name: string
  iat?: number
  exp?: number
}

export function createSecureToken(userId: string, email = "", name = ""): string {
  return jwt.sign({ userId, email, name }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export function getAuthToken(): string | null {
  // For server components
  if (typeof window === "undefined") {
    const cookieStore = cookies()
    return cookieStore.get("auth_token")?.value || null
  }

  // For client components
  return null
}

export function getUserIdFromToken(token: string): string | null {
  const payload = verifyToken(token)
  return payload?.userId || null
}

export function getCurrentUser(request: Request): JwtPayload | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]
  return verifyToken(token)
}

// Add the missing removeAuthCookie function
export function removeAuthCookie() {
  if (typeof window === "undefined") {
    const cookieStore = cookies()
    // Delete the auth cookie by setting it to expire in the past
    cookieStore.set("auth_token", "", {
      expires: new Date(0),
      path: "/",
    })
  }
  return { success: true }
}

