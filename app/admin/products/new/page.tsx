"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft, Save, Trash, Upload } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [images, setImages] = useState<string[]>(["/placeholder.svg?height=300&width=300"])
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Admin check - in a real app, you'd check for admin role
  const isAdmin = isAuthenticated && user?.email === "admin@example.com"

  // Available moods
  const moods = [
    "Creative",
    "Anxious",
    "Fragile",
    "Playful",
    "Muddled",
    "Wired",
    "Caring",
    "Open",
    "Serene",
    "Mellow",
    "Eccentric",
    "Vulnerable",
    "Curious",
    "Unhinged",
    "Freespirited",
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/signin?redirect=/admin/products/new")
      } else if (!isAdmin) {
        router.push("/")
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router, mounted])

  const handleMoodToggle = (mood: string) => {
    setSelectedMoods((prev) => (prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !description || !price || !stock || selectedMoods.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one mood.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, you would send this to your API
      // For now, we'll just simulate a successful creation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Product Created",
        description: `${name} has been added to your product catalog.`,
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted || isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  if (!isAuthenticated || !isAdmin) {
    return <div className="container mx-auto px-4 py-12 text-center">Access denied. Admin privileges required.</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/products">
            <ArrowLeft size={16} className="mr-2" />
            Back to Products
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Basic information about the product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Aromatherapy Diffuser"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product in detail..."
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="29.99"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      step="1"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="100"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload images of your product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}

                  <div className="aspect-square border rounded-md border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50">
                    <div className="text-center">
                      <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload Image</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Mood Categories</CardTitle>
                <CardDescription>Select moods that match this product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moods.map((mood) => (
                    <div key={mood} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mood-${mood}`}
                        checked={selectedMoods.includes(mood)}
                        onCheckedChange={() => handleMoodToggle(mood)}
                      />
                      <Label htmlFor={`mood-${mood}`}>{mood}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select defaultValue="draft">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Product
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

