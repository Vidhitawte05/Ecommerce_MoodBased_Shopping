import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { Badge } from "@/components/ui/badge"

// Mock data for sale products
const saleProducts = [
  { id: 201, name: "Meditation Cushion", originalPrice: 59.99, price: 39.99, discount: 33, image: "/placeholder.svg?height=300&width=300", rating: 4.5 },
  { id: 202, name: "Relaxation Sound Machine", originalPrice: 45.99, price: 29.99, discount: 35, image: "/placeholder.svg?height=300&width=300", rating: 4.6 },
  { id: 203, name: "Self-Care Gift Box", originalPrice: 89.99, price: 59.99, discount: 33, image: "/placeholder.svg?height=300&width=300", rating: 4.7 },
  { id: 204, name: "Stress-Relief Coloring Book", originalPrice: 19.99, price: 12.99, discount: 35, image: "/placeholder.svg?height=300&width=300", rating: 4.3 },
  { id: 205, name: "Calming Bath Set", originalPrice: 49.99, price: 34.99, discount: 30, image: "/placeholder.svg?height=300&width=300", rating: 4.8 },
  { id: 206, name: "Aromatherapy Bracelet", originalPrice: 29.99, price: 19.99, discount: 33, image: "/placeholder.svg?height=300&width=300", rating: 4.4 },
  { id: 207, name: "Happy Light Therapy Lamp", originalPrice: 99.99, price: 69.99, discount: 30, image: "/placeholder.svg?height=300&width=300", rating: 4.9 },
  { id: 208, name: "Gratitude Journal", originalPrice: 24.99, price: 16.99, discount: 32, image: "/placeholder.svg?height=300&width=300", rating: 4.5 },
]

export default function SalePage() {
  // Convert sale products to the format expected by ProductCard
  const formattedProducts = saleProducts.map(({ originalPrice, discount, ...product }) => ({
    ...product,
    saleInfo: { originalPrice, discount }
  }))

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-primary/10 rounded-lg p-6 mb-12 text-center">
        <Badge className="mb-2 bg-primary">Limited Time</Badge>
        <h1 className="text-4xl font-bold mb-4">Special Sale</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
          Enjoy great discounts on our mood-enhancing products. 
          These offers won't last long, so grab your favorites while supplies last!
        </p>
      </div>

      <div className="product-grid mb-12">
        {formattedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="text-center">
        <p className="mb-4 text-muted-foreground">
          Sale ends soon! Don't miss out on these amazing deals.
        </p>
        <Button asChild>
          <a href="#sale-alert">Get Sale Alerts</a>
        </Button>
      </div>
    </div>
  )
}
