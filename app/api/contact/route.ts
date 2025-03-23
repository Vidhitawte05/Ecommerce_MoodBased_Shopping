import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Save to database
    const submission = await db.submitContactForm({
      name,
      email,
      subject: subject || "Contact Form Submission",
      message,
    })

    // In a real app, you would send an email here
    // For example, using nodemailer or a service like SendGrid

    return NextResponse.json({ success: true, submission })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Failed to process contact form" }, { status: 500 })
  }
}

