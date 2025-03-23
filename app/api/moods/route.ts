import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const moods = await db.getMoods()
    return NextResponse.json({ moods })
  } catch (error) {
    console.error("Error fetching moods:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

