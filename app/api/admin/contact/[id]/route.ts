import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)

    if (!payload || !payload.userId || payload.email !== "admin@example.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the contact submission
    const submission = await prisma.contactSubmission.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!submission) {
      return NextResponse.json({ error: "Contact submission not found" }, { status: 404 })
    }

    return NextResponse.json({ submission })
  } catch (error) {
    console.error("Error fetching contact submission:", error)
    return NextResponse.json({ error: "Failed to fetch contact submission" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)

    if (!payload || !payload.userId || payload.email !== "admin@example.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the update data from the request
    const updateData = await request.json()

    // Update the contact submission
    const updatedSubmission = await prisma.contactSubmission.update({
      where: {
        id: params.id,
      },
      data: {
        isRead: updateData.isRead,
      },
    })

    return NextResponse.json({ submission: updatedSubmission })
  } catch (error) {
    console.error("Error updating contact submission:", error)
    return NextResponse.json({ error: "Failed to update contact submission" }, { status: 500 })
  }
}

