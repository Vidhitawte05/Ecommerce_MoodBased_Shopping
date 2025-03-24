const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

exports.handler = async (event, context) => {
  // This is a simple function to test if Prisma is working
  try {
    // Perform a simple query
    const count = await prisma.user.count()

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Prisma is working!", userCount: count }),
    }
  } catch (error) {
    console.error("Prisma error:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to connect to database", details: error.message }),
    }
  }
}

