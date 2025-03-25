import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Get the current user
    const user = getCurrentUser(request)

    // Get all headers for debugging
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Get cookies (if available)
    const cookies: Record<string, string> = {}
    if ("cookies" in request && typeof (request as any).cookies.getAll === "function") {
      const cookieList = (request as any).cookies.getAll()
      cookieList.forEach((cookie: any) => {
        cookies[cookie.name] = cookie.value
      })
    }

    return NextResponse.json({
      authenticated: !!user,
      user: user
        ? {
            userId: user.userId,
            email: user.email,
            name: user.name,
          }
        : null,
      headers: {
        // Only include relevant headers for security
        authorization: headers.authorization ? "Bearer [REDACTED]" : undefined,
        cookie: headers.cookie ? "[REDACTED]" : undefined,
        host: headers.host,
        origin: headers.origin,
        referer: headers.referer,
      },
      cookies: {
        auth_token: cookies.auth_token ? "[EXISTS]" : undefined,
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NETLIFY: process.env.NETLIFY,
      },
    })
  } catch (error) {
    console.error("Auth debug error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

