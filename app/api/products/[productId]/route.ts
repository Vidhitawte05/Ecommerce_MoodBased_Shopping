import { NextResponse } from "next/server"

// Mock product data
const mockProducts: Record<string, any> = {
  "1": {
    id: 1,
    name: "Idea Journal",
    price: 19.99,
    images: ["/idea_journal.webp?height=600&width=600", "/idea_journal2.webp?height=600&width=600"],
    description:
      "Unlock your creativity with this beautifully designed idea journal. Perfect for brainstorming, sketching, and capturing your thoughts.",
    details: {
      material: "Recycled paper, vegan leather cover",
      dimensions: "8.5 x 11 inches",
      pages: "120 pages",
      features: "Lay-flat binding, pocket folder, elastic closure",
    },
    moods: ["Creative", "Curious"],
    rating: 4.5,
    reviews: 128,
    stock: 15,
    shipping: "Free shipping on orders over $18",
  },
  // Other products...
  "2": {
    id: 2,
    name: "Weighted Blanket",
    price: 79.99,
    images: ["/weighted_blankets.webp?height=600&width=600", "/weighted_blankets1.webp?height=600&width=600"],
    description:
      "Soft, therapeutic blankets designed to provide deep pressure stimulation for relaxation and better sleep.",
    details: {
      material: "Recycled paper, vegan leather cover",
      dimensions: "8.5 x 11 inches",
      pages: "120 pages",
      features: "Lay-flat binding, pocket folder, elastic closure",
    },
    moods: ["Anxious", "Fragile"],
    rating: 4.8,
    reviews: 95,
    stock: 8,
    shipping: "Free shipping on orders over $35",
  },
  "3": {
    id: 3,
    name: "Aromatherapy Diffuser",
    price: 39.99,
    images: ["/diffusers.jpg?height=600&width=600", "/diffusers1.jpg?height=600&width=600"],
    description:
      "A device that disperses essential oils into the air, creating a calming and fragrant atmosphere.",
    details: {
      material: "Recycled paper, vegan leather cover",
      dimensions: "8.5 x 11 inches",
      pages: "120 pages",
      features: "Lay-flat binding, pocket folder, elastic closure",
    },
    moods: ["Anxious", "Serene"],
    rating: 4.6,
    reviews: 72,
    stock: 20,
    shipping: "Free shipping on orders over $35",
  },
  "4": {
    id: 4,
    name: "Stress Relief Tea",
    price: 14.99,
    images: ["/stress_relief.webp?height=600&width=600", "/stress_relief1.webp?height=600&width=600"],
    description:
      "A soothing herbal tea blend crafted to reduce stress, promote relaxation, and improve well-being.",
    details: {
      material: "Recycled paper, vegan leather cover",
      dimensions: "8.5 x 11 inches",
      pages: "120 pages",
      features: "Lay-flat binding, pocket folder, elastic closure",
    },
    moods: ["Anxious", "Muddled"],
    rating: 4.4,
    reviews: 58,
    stock: 35,
    shipping: "Free shipping on orders over $35",
  },
  "5": {
    id: 5,
    name: "Watercolor Set",
    price: 34.99,
    images: ["/watercolor_set.webp?height=600&width=600", "/watercolor_set1.webp?height=600&width=600"],
    description:
      "A vibrant collection of watercolor paints, brushes, and paper for creative and expressive painting.",
    details: {
      material: "Recycled paper, vegan leather cover",
      dimensions: "8.5 x 11 inches",
      pages: "120 pages",
      features: "Lay-flat binding, pocket folder, elastic closure",
    },
    moods: ["Creative", "Playful"],
    rating: 4.7,
    reviews: 42,
    stock: 15,
    shipping: "Free shipping on orders over $35",
  },
  "6": {
    id: 6,
    name: "Meditation Journal",
    price: 49.99,
    images: ["/meditation_journal.webp?height=600&width=600", "/meditation_journal1.webp?height=600&width=600"],
    description:
      "A guided journal designed to help track mindfulness, reflections, and personal growth.",
    details: {
      material: "Recycled paper, vegan leather cover",
      dimensions: "8.5 x 11 inches",
      pages: "120 pages",
      features: "Lay-flat binding, pocket folder, elastic closure",
    },
    moods: ["Serene", "Anxious"],
    rating: 4.3,
    reviews: 38,
    stock: 12,
    shipping: "Free shipping on orders over $19",
  },
  "7": {
    id: 7,
    name: "Essential Oil Set",
    price: 29.99,
    images: ["/oils.webp?height=600&width=600", "/oils1.webp?height=600&width=600"],
    description:
      "A curated selection of pure essential oils known for their therapeutic and aromatic benefits.",
    details: {
      material: "Recycled paper, vegan leather cover",
      dimensions: "8.5 x 11 inches",
      pages: "120 pages",
      features: "Lay-flat binding, pocket folder, elastic closure",
    },
    moods: ["Anxious", "Serene", "Muddled"],
    rating: 4.5,
    reviews: 64,
    stock: 25,
    shipping: "Free shipping on orders over $25",
  },
  "8": {
    id: 8,
    name: "Gratitude Journal",
    price: 18.99,
    images: ["/mood_journal.webp?height=600&width=600", "/mood_journal1.webp?height=600&width=600"],
    description:
      "A thoughtfully designed notebook to cultivate positivity by recording daily gratitude and reflections.",
    details: {
      material: "Recycled paper, vegan leather cover",
      dimensions: "8.5 x 11 inches",
      pages: "120 pages",
      features: "Lay-flat binding, pocket folder, elastic closure",
    },
    moods: ["Fragile", "Caring"],
    rating: 4.6,
    reviews: 52,
    stock: 18,
    shipping: "Free shipping on orders over $35",
  },
}

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  try {
    const id = params.productId

    // Check if product exists in our mock data
    if (!mockProducts[id]) {
      // If not found, create a generic product
      const genericProduct = {
        id: Number(id),
        name: `Product ${id}`,
        price: 29.99,
        images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
        description: "This is a product description.",
        details: {
          material: "High-quality materials",
          dimensions: "Standard size",
          features: "Multiple features",
        },
        moods: ["Creative", "Serene"],
        rating: 4.5,
        reviews: 10,
        stock: 20,
        shipping: "Free shipping on orders over $35",
      }

      return NextResponse.json({ product: genericProduct })
    }

    return NextResponse.json({ product: mockProducts[id] })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

