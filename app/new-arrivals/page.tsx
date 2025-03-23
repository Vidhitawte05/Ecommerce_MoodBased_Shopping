import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"

// Mock data for new arrival products
const newProducts = [
  { id: 101, name: "Mindfulness Alarm Clock", price: 49.99, image: "/placeholder.svg?height=300&width=300", rating: 4.8 },
  { id: 102, name: "Aroma Therapy Set", price: 65.99, image: "/placeholder.svg?height=300&width=300", rating: 4.9 },
  { id: 103, name: "Zen Garden Kit", price: 29.99, image: "/placeholder.svg?height=300&width=300", rating: 4.7 },
  { id: 104, name: "Relaxation Pillow", price: 39.99, image: "/placeholder.svg?height=300&width=300", rating: 4.6 },
  { id: 105, name: "Mood-Enhancing Light", price: 79.99, image: "/placeholder.svg?height=300&width=300", rating: 4.8 },
  { id: 106, name: "Mindful Journal", price: 24.99, image: "/placeholder.svg?height=300&width=300", rating: 4.5 },
  { id: 107, name: "Stress-Relief Candle Set", price: 34.99, image: "/placeholder.svg?height=300&width=300", rating: 4.7 },
  { id: 108, name: "Calming Teas Collection", price: 27.99, image: "/placeholder.svg?height=300&width=300", rating: 4.6 },
]

export default function NewArrivalsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">New Arrivals</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our latest mood-enhancing products, fresh from our collection. 
          Be the first to experience these new additions designed to elevate your emotional wellbeing.
        </p>
      </div>

      <div className="product-grid mb-12">
        {newProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">
          Want to be notified when new products arrive?
        </p>
        <Button asChild>
          <a href="#subscribe">Subscribe to Our Newsletter</a>
        </Button>
      </div>
    </div>
  )
}
