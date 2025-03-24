import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        subject: subject || "Contact Form Submission",
        message,
        isRead: false,
      },
    })

    // In a real app, you would send an email here
    // For example, using nodemailer or a service like SendGrid
    // For demo purposes, we'll just log it
    console.log("Contact form submission:", {
      name,
      email,
      subject: subject || "Contact Form Submission",
      message,
    })

    // For demo, simulate sending an email
    const emailSent = true

    return NextResponse.json({
      success: true,
      submission,
      emailSent,
    })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Failed to process contact form" }, { status: 500 })
  }
}

