"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft, Edit, PlusCircle, Search, Trash } from "lucide-react"
import type { Product } from "@/lib/db"
import Image from "next/image"

export default function AdminProductsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Admin check - in a real app, you'd check for admin role
  const isAdmin = isAuthenticated && user?.email === "admin@example.com"

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/admin/products")
    } else if (!isLoading && !isAdmin) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAdmin) return

      try {
        setIsProductsLoading(true)

        const response = await fetch("/api/products")

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data.products)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      } finally {
        setIsProductsLoading(false)
      }
    }

    if (isAdmin) {
      fetchProducts()
    }
  }, [isAdmin, toast])

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      setProducts(products.filter((product) => product.id !== productId))

      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.moods.some((mood) => mood.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  if (!isAuthenticated || !isAdmin) {
    return <div className="container mx-auto px-4 py-12 text-center">Access denied. Admin privileges required.</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Product Management</h1>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle size={16} className="mr-2" />
            Add New Product
          </Link>
        </Button>
      </div>

      {isProductsLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Products Found</CardTitle>
            <CardDescription>
              {searchQuery ? "No products match your search criteria." : "There are no products in your store yet."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/products/new">
                <PlusCircle size={16} className="mr-2" />
                Add Your First Product
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b bg-muted/50">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Image</div>
            <div className="col-span-3">Product</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Stock</div>
            <div className="col-span-2">Moods</div>
            <div className="col-span-2">Actions</div>
          </div>

          {filteredProducts.map((product) => (
            <div key={product.id} className="grid grid-cols-12 gap-4 p-4 border-b items-center">
              <div className="col-span-1">{product.id}</div>
              <div className="col-span-2">
                <div className="relative w-16 h-16 rounded overflow-hidden">
                  <Image
                    src={product.images[0] || "/placeholder.svg?height=64&width=64"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="col-span-3">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground truncate">{product.description}</p>
              </div>
              <div className="col-span-1">${product.price.toFixed(2)}</div>
              <div className="col-span-1">
                <span className={product.stock < 10 ? "text-red-500 font-medium" : ""}>{product.stock}</span>
              </div>
              <div className="col-span-2">
                <div className="flex flex-wrap gap-1">
                  {product.moods.map((mood) => (
                    <span key={mood} className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {mood}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/products/${product.id}`}>
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                    <Trash size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

