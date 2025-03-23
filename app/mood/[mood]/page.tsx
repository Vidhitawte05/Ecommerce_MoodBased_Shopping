"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"

// Mood descriptions
const moodDescriptions = {
  creative: "Enhance your creative energy with products designed to inspire and spark new ideas.",
  anxious: "Find comfort and calm with products that help reduce anxiety and promote relaxation.",
  playful: "Embrace your playful side with fun products that bring joy and lightheartedness.",
  fragile: "Nurture yourself with gentle, comforting products that provide support during sensitive times.",
  muddled: "Clear your mind with products that help organize thoughts and reduce mental clutter.",
  wired: "Channel your high energy into productive outlets with these energizing products.",
  caring: "Express your nurturing nature with products that help you care for yourself and others.",
  open: "Explore new possibilities with products that encourage openness and new experiences.",
  serene: "Maintain your peaceful state with products that promote tranquility and balance.",
  mellow: "Complement your relaxed mood with soothing products that enhance your calm state.",
  eccentric: "Celebrate your unique perspective with unconventional products that match your distinctive style.",
  vulnerable: "Support yourself during vulnerable moments with products that offer comfort and reassurance.",
  curious: "Feed your inquisitive mind with products that satisfy your thirst for knowledge and discovery.",
  unhinged: "Find balance and grounding with products that help stabilize fluctuating emotions.",
  freespirited: "Embrace your independent nature with products that celebrate freedom and spontaneity.",
}

export default function MoodPage({ params }: { params: { mood: string } }) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mood = params.mood.toLowerCase()
  const description =
    moodDescriptions[mood as keyof typeof moodDescriptions] ||
    "Discover products tailored to your current mood and emotional state."

  // Capitalize first letter of mood for display
  const displayMood = mood.charAt(0).toUpperCase() + mood.slice(1)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products?mood=${mood}`)

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data.products || [])
      } catch (err) {
        console.error("Error fetching mood products:", err)
        setError("Failed to load products. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [mood])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{displayMood} Mood</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{description}</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{displayMood} Mood</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{description}</p>
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-8">{error}</div>
        <Button asChild>
          <Link href="/quiz">Retake Mood Quiz</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{displayMood} Mood</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Recommended Products</h2>
        <Button variant="outline" asChild>
          <Link href="/quiz">Retake Mood Quiz</Link>
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="product-grid mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-6">No products found for this mood.</p>
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">Not seeing what you're looking for?</h3>
        <p className="text-muted-foreground mb-6">Browse our complete collection or try another mood category.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/moods">Explore Other Moods</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

