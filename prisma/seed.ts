import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create some products
  const products = [
    {
      name: "Idea Journal",
      description:
        "Unlock your creativity with this beautifully designed idea journal. Perfect for brainstorming, sketching, and capturing your thoughts.",
      price: 19.99,
      images: ["/placeholder.svg?height=300&width=300"],
      moods: ["Creative", "Curious"],
      stock: 100,
      rating: 4.5,
      reviews: 50,
    },
    {
      name: "Weighted Blanket",
      description: "Find comfort and calm with this soothing weighted blanket.",
      price: 79.99,
      images: ["/placeholder.svg?height=300&width=300"],
      moods: ["Anxious", "Fragile"],
      stock: 50,
      rating: 4.8,
      reviews: 120,
    },
    {
      name: "Aromatherapy Diffuser",
      description: "Create a calming atmosphere with this elegant aromatherapy diffuser.",
      price: 39.99,
      images: ["/placeholder.svg?height=300&width=300"],
      moods: ["Anxious", "Serene"],
      stock: 75,
      rating: 4.6,
      reviews: 85,
    },
    {
      name: "Stress Relief Tea",
      description: "A soothing blend of herbs to help you relax and unwind.",
      price: 14.99,
      images: ["/placeholder.svg?height=300&width=300"],
      moods: ["Anxious", "Muddled"],
      stock: 200,
      rating: 4.4,
      reviews: 65,
    },
    {
      name: "Watercolor Set",
      description: "Express yourself with this premium watercolor set, perfect for artists of all levels.",
      price: 34.99,
      images: ["/placeholder.svg?height=300&width=300"],
      moods: ["Creative", "Playful"],
      stock: 60,
      rating: 4.7,
      reviews: 42,
    },
    {
      name: "Desk Lamp with Color Changing",
      description: "Illuminate your workspace with this adjustable desk lamp featuring color-changing capabilities.",
      price: 49.99,
      images: ["/placeholder.svg?height=300&width=300"],
      moods: ["Creative", "Wired"],
      stock: 40,
      rating: 4.2,
      reviews: 38,
    },
    {
      name: "Fidget Cube",
      description: "Keep your hands busy and mind focused with this satisfying fidget cube.",
      price: 9.99,
      images: ["/placeholder.svg?height=300&width=300"],
      moods: ["Anxious", "Wired"],
      stock: 150,
      rating: 4.3,
      reviews: 110,
    },
    {
      name: "Board Game Set",
      description: "Bring friends and family together with this collection of classic board games.",
      price: 49.99,
      images: ["/placeholder.svg?height=300&width=300"],
      moods: ["Playful", "Open"],
      stock: 35,
      rating: 4.8,
      reviews: 28,
    },
    {
      name: "Colorful Socks",
      description: "Add a pop of color to your day with these vibrant, comfortable socks.",
      price: 12.99,
      images: ["/placeholder.svg?height=300&width=300"],
      moods: ["Playful", "Freespirited"],
      stock: 100,
      rating: 4.5,
      reviews: 55,
    },
    {
      name: "Self-Care Box",
      description: "Treat yourself or someone special with this curated box of self-care essentials.",
      price: 59.99,
      images: ["/placeholder.svg?height=300&width=300"],
      moods: ["Caring", "Fragile"],
      stock: 30,
      rating: 4.9,
      reviews: 22,
    },
    {
      name: "Mood Journal",
      description: "Track your emotions and reflect on your day with this thoughtfully designed mood journal.",
      price: 19.99,
      images: ["/placeholder.svg?height=300&width=300"],
      moods: ["Muddled", "Vulnerable"],
      stock: 80,
      rating: 4.6,
      reviews: 48,
    },
    {
      name: "Scented Candle",
      description: "Create a cozy atmosphere with this long-lasting, beautifully scented candle.",
      price: 24.99,
      images: ["/placeholder.svg?height=300&width=300"],
      moods: ["Serene", "Mellow"],
      stock: 90,
      rating: 4.7,
      reviews: 75,
    },
  ]

  console.log("Creating products...")
  for (const product of products) {
    // Use upsert to avoid duplicate products
    await prisma.product.upsert({
      where: { name: product.name },
      update: product,
      create: product,
    })
  }

  console.log("Creating test user...")
  // Create a test user
  const hashedPassword = await bcrypt.hash("password123", 10)
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {
      name: "Test User",
      password: hashedPassword,
    },
    create: {
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    },
  })

  // Create a wishlist for the test user
  console.log("Creating test wishlist...")
  const wishlist = await prisma.wishlist.upsert({
    where: {
      id: "test-wishlist",
    },
    update: {},
    create: {
      id: "test-wishlist",
      userId: user.id,
    },
  })

  // Add some items to the wishlist
  const ideaJournal = await prisma.product.findUnique({ where: { name: "Idea Journal" } })
  const aromatherapyDiffuser = await prisma.product.findUnique({ where: { name: "Aromatherapy Diffuser" } })

  if (ideaJournal) {
    await prisma.wishlistItem.upsert({
      where: {
        id: "test-wishlist-item-1",
      },
      update: {},
      create: {
        id: "test-wishlist-item-1",
        wishlistId: wishlist.id,
        productId: ideaJournal.id,
      },
    })
  }

  if (aromatherapyDiffuser) {
    await prisma.wishlistItem.upsert({
      where: {
        id: "test-wishlist-item-2",
      },
      update: {},
      create: {
        id: "test-wishlist-item-2",
        wishlistId: wishlist.id,
        productId: aromatherapyDiffuser.id,
      },
    })
  }

  // Create a test order
  console.log("Creating test order...")
  const order = await prisma.order.upsert({
    where: {
      id: "test-order-1",
    },
    update: {},
    create: {
      id: "test-order-1",
      userId: user.id,
      status: "delivered",
      total: 59.98,
      paymentMethod: "paypal",
      paymentId: "PAYID-TEST123456",
      shippingAddress: {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "1234567890",
        address: "123 Test Street",
        city: "Test City",
        state: "Test State",
        zip: "12345",
        country: "us",
      },
    },
  })

  // Add items to the order
  if (ideaJournal) {
    await prisma.orderItem.upsert({
      where: {
        id: "test-order-item-1",
      },
      update: {},
      create: {
        id: "test-order-item-1",
        orderId: order.id,
        productId: ideaJournal.id,
        quantity: 1,
        price: ideaJournal.price,
      },
    })
  }

  if (aromatherapyDiffuser) {
    await prisma.orderItem.upsert({
      where: {
        id: "test-order-item-2",
      },
      update: {},
      create: {
        id: "test-order-item-2",
        orderId: order.id,
        productId: aromatherapyDiffuser.id,
        quantity: 1,
        price: aromatherapyDiffuser.price,
      },
    })
  }

  console.log("Database seeded successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

