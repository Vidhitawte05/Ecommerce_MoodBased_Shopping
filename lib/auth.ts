import { cookies } from "next/headers"

export function removeAuthCookie() {
  try {
    cookies().delete("auth_token")
    return { success: true }
  } catch (error) {
    console.error("Error removing auth cookie:", error)
    return { success: false, error: error }
  }
}

