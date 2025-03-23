import { NextResponse } from "next/server"

// Mock product data
const products = [
  {
    id: 1,
    name: "Idea Journal",
    price: 19.99,
    images: ["/idea_journal.webp?height=300&width=300"],
    moods: ["Creative", "Curious"],
    rating: 4.5,
    reviews: 128,
    stock: 15,
  },
  {
    id: 2,
    name: "Weighted Blanket",
    price: 79.99,
    images: ["/weighted_blankets.webp?height=300&width=300"],
    moods: ["Anxious", "Fragile"],
    rating: 4.8,
    reviews: 95,
    stock: 8,
  },
  {
    id: 3,
    name: "Aromatherapy Diffuser",
    price: 39.99,
    images: ["/diffusers.jpg?height=300&width=300"],
    moods: ["Anxious", "Serene"],
    rating: 4.6,
    reviews: 72,
    stock: 20,
  },
  {
    id: 4,
    name: "Stress Relief Tea",
    price: 14.99,
    images: ["/stress_relief.webp?height=300&width=300"],
    moods: ["Anxious", "Muddled"],
    rating: 4.4,
    reviews: 58,
    stock: 35,
  },
  {
    id: 5,
    name: "Watercolor Set",
    price: 34.99,
    images: ["/watercolor_set.webp?height=300&width=300"],
    moods: ["Creative", "Playful"],
    rating: 4.7,
    reviews: 42,
    stock: 15,
  },
  {
    id: 6,
    name: "Meditation Journal",
    price: 49.99,
    images: ["/meditation_journal.webp?height=300&width=300"],
    moods: ["Serene", "Anxious"],
    rating: 4.3,
    reviews: 38,
    stock: 12,
  },
  {
    id: 7,
    name: "Essential Oil Set",
    price: 29.99,
    images: ["/oils.webp?height=300&width=300"],
    moods: ["Anxious", "Serene", "Muddled"],
    rating: 4.5,
    reviews: 64,
    stock: 25,
  },
  {
    id: 8,
    name: "Gratitude Journal",
    price: 18.99,
    images: ["/mood_journal.webp?height=300&width=300"],
    moods: ["Fragile", "Caring"],
    rating: 4.6,
    reviews: 52,
    stock: 18,
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mood = searchParams.get("mood")

    let filteredProducts

    if (mood) {
      filteredProducts = products.filter((product) => product.moods.some((m) => m.toLowerCase() === mood.toLowerCase()))

      // If no products match the mood, return all products
      if (filteredProducts.length === 0) {
        filteredProducts = products
      }
    } else {
      filteredProducts = products
    }

    return NextResponse.json({ products: filteredProducts })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

