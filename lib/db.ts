// This is a mock database service with persistent storage using localStorage
// In a real application, you would use a real database like PostgreSQL with Prisma

// User types
export type User = {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  createdAt: Date
}

// Product types
export type Product = {
  id: number
  name: string
  description: string
  price: number
  images: string[]
  moods: string[]
  stock: number
  rating: number
  reviews: number
}

// Order types
export type OrderItem = {
  productId: number
  quantity: number
  price: number
}

export type Order = {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  shippingAddress: Address
  paymentMethod: string
  createdAt: Date
  trackingInfo?: TrackingInfo
}

export type TrackingInfo = {
  carrier: string
  trackingNumber: string
  estimatedDelivery: string
  trackingHistory: TrackingEvent[]
}

export type TrackingEvent = {
  status: string
  location: string
  timestamp: string
}

export type Address = {
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

// Contact form submission type
export type ContactSubmission = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
  isRead: boolean
}

// Mock database with localStorage persistence
class Database {
  private users: User[] = []
  private products: Product[] = []
  private orders: Record<string, Order[]> = {}
  private wishlist: Record<string, number[]> = {}
  private contactSubmissions: ContactSubmission[] = []
  private moods: string[] = ["Creative", "Anxious", "Fragile", "Playful", "Muddled", "Wired", "Caring", "Open"]

  constructor() {
    this.loadFromStorage()
    this.initializeProducts()
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      try {
        const usersData = localStorage.getItem("db_users")
        if (usersData) this.users = JSON.parse(usersData)

        const productsData = localStorage.getItem("db_products")
        if (productsData) this.products = JSON.parse(productsData)

        const ordersData = localStorage.getItem("db_orders")
        if (ordersData) this.orders = JSON.parse(ordersData)

        const wishlistData = localStorage.getItem("db_wishlist")
        if (wishlistData) this.wishlist = JSON.parse(wishlistData)

        const contactData = localStorage.getItem("db_contact_submissions")
        if (contactData) this.contactSubmissions = JSON.parse(contactData)
      } catch (error) {
        console.error("Error loading from localStorage:", error)
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("db_users", JSON.stringify(this.users))
        localStorage.setItem("db_products", JSON.stringify(this.products))
        localStorage.setItem("db_orders", JSON.stringify(this.orders))
        localStorage.setItem("db_wishlist", JSON.stringify(this.wishlist))
        localStorage.setItem("db_contact_submissions", JSON.stringify(this.contactSubmissions))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    }
  }

  private initializeProducts() {
    // Only initialize products if they don't exist
    if (this.products.length === 0) {
      this.products = [
        {
          id: 1,
          name: "Idea Journal",
          description: "A beautiful journal to capture your creative ideas and inspirations.",
          price: 19.99,
          images: ["/placeholder.svg?height=300&width=300"],
          moods: ["Creative", "Playful"],
          stock: 50,
          rating: 4.5,
          reviews: 28,
        },
        {
          id: 2,
          name: "Meditation Cushion",
          description: "Comfortable cushion for your meditation practice.",
          price: 49.99,
          images: ["/placeholder.svg?height=300&width=300"],
          moods: ["Anxious", "Muddled"],
          stock: 35,
          rating: 4.8,
          reviews: 42,
        },
        {
          id: 3,
          name: "Aromatherapy Diffuser",
          description: "Essential oil diffuser to create a calming atmosphere.",
          price: 39.99,
          images: ["/placeholder.svg?height=300&width=300"],
          moods: ["Anxious", "Fragile"],
          stock: 20,
          rating: 4.7,
          reviews: 36,
        },
        {
          id: 4,
          name: "Weighted Blanket",
          description: "Provides comfort and helps reduce anxiety.",
          price: 89.99,
          images: ["/placeholder.svg?height=300&width=300"],
          moods: ["Anxious", "Fragile"],
          stock: 15,
          rating: 4.9,
          reviews: 54,
        },
      ]
      this.saveToStorage()
    }
  }

  // User methods
  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const newUser = {
      ...user,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
    }
    this.users.push(newUser)
    this.saveToStorage()
    return newUser
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return this.products
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.products.find((product) => product.id === id) || null
  }

  async getProductsByMood(mood: string): Promise<Product[]> {
    return this.products.filter((product) => product.moods.includes(mood))
  }

  async addProduct(product: Omit<Product, "id">): Promise<Product> {
    const newId = this.products.length > 0 ? Math.max(...this.products.map((p) => p.id)) + 1 : 1
    const newProduct = {
      ...product,
      id: newId,
    }
    this.products.push(newProduct)
    this.saveToStorage()
    return newProduct
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex((p) => p.id === id)
    if (index === -1) return null

    this.products[index] = { ...this.products[index], ...updates }
    this.saveToStorage()
    return this.products[index]
  }

  async deleteProduct(id: number): Promise<boolean> {
    const initialLength = this.products.length
    this.products = this.products.filter((p) => p.id !== id)
    this.saveToStorage()
    return this.products.length < initialLength
  }

  // Order methods
  async createOrder(order: Omit<Order, "id" | "createdAt">): Promise<Order> {
    const newOrder = {
      ...order,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date(),
    }

    if (!this.orders[order.userId]) {
      this.orders[order.userId] = []
    }

    this.orders[order.userId].push(newOrder)
    this.saveToStorage()
    return newOrder
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orders[userId] || []
  }

  async getOrderById(userId: string, orderId: string): Promise<Order | null> {
    const userOrders = this.orders[userId] || []
    return userOrders.find((order) => order.id === orderId) || null
  }

  async updateOrderStatus(userId: string, orderId: string, status: Order["status"]): Promise<Order | null> {
    const userOrders = this.orders[userId] || []
    const orderIndex = userOrders.findIndex((order) => order.id === orderId)

    if (orderIndex === -1) return null

    userOrders[orderIndex].status = status
    this.saveToStorage()
    return userOrders[orderIndex]
  }

  async updateOrderTracking(userId: string, orderId: string, trackingInfo: TrackingInfo): Promise<Order | null> {
    const userOrders = this.orders[userId] || []
    const orderIndex = userOrders.findIndex((order) => order.id === orderId)

    if (orderIndex === -1) return null

    userOrders[orderIndex].trackingInfo = trackingInfo
    this.saveToStorage()
    return userOrders[orderIndex]
  }

  // Wishlist methods
  async addToWishlist(userId: string, productId: number): Promise<boolean> {
    if (!this.wishlist[userId]) {
      this.wishlist[userId] = []
    }

    if (!this.wishlist[userId].includes(productId)) {
      this.wishlist[userId].push(productId)
      this.saveToStorage()
      return true
    }

    return false
  }

  async removeFromWishlist(userId: string, productId: number): Promise<boolean> {
    if (!this.wishlist[userId]) return false

    const index = this.wishlist[userId].indexOf(productId)
    if (index !== -1) {
      this.wishlist[userId].splice(index, 1)
      this.saveToStorage()
      return true
    }

    return false
  }

  async getWishlist(userId: string): Promise<number[]> {
    return this.wishlist[userId] || []
  }

  // Contact form methods
  async submitContactForm(
    submission: Omit<ContactSubmission, "id" | "createdAt" | "isRead">,
  ): Promise<ContactSubmission> {
    const newSubmission = {
      ...submission,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      isRead: false,
    }

    this.contactSubmissions.push(newSubmission)
    this.saveToStorage()
    return newSubmission
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return this.contactSubmissions
  }

  async markContactSubmissionAsRead(id: string): Promise<ContactSubmission | null> {
    const index = this.contactSubmissions.findIndex((s) => s.id === id)
    if (index === -1) return null

    this.contactSubmissions[index].isRead = true
    this.saveToStorage()
    return this.contactSubmissions[index]
  }

  // Mood methods
  async getMoods(): Promise<string[]> {
    return this.moods
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    return this.users.map((user) => ({
      ...user,
      password: "********", // Don't expose passwords
    }))
  }

  async getAllOrders(): Promise<{ userId: string; orders: Order[] }[]> {
    return Object.entries(this.orders).map(([userId, orders]) => ({
      userId,
      orders,
    }))
  }
}

// Export a singleton instance
export const db = new Database()

// Simple hash function for passwords
export function hashPassword(password: string): string {
  // In a real app, use bcrypt or similar
  return password
}

