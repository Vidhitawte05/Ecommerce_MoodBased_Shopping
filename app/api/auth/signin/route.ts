import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createSecureToken } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate token
    const token = createSecureToken(user.id, user.email, user.name)

    // Create response with user data and token
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    })

    // Set HTTP-only cookie
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

