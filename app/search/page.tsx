import { ProductCard } from "@/components/product-card"
import prisma from "@/lib/prisma"

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No products found matching your search.</p>
      )}
    </div>
  )
}

