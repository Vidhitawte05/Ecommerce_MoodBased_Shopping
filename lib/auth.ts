import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

// Use environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here"

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    return null
  }
}

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function createSecureToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function getTokenFromCookies() {
  const cookieStore = cookies()
  return cookieStore.get("token")?.value
}

export function getUserIdFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch (error) {
    return null
  }
}

export function getCurrentUser(request: Request) {
  const authHeader = request.headers.get("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}

export function removeAuthCookie() {
  // Implementation for removing auth cookie
  return { success: true }
}

