// This script is used to migrate the database
const { execSync } = require("child_process")
const path = require("path")

// Load environment variables
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.production") })

console.log("Starting database migration...")

try {
  // Run Prisma migrations
  execSync("npx prisma migrate deploy", { stdio: "inherit" })
  console.log("Database migration completed successfully")

  // Generate Prisma client
  execSync("npx prisma generate", { stdio: "inherit" })
  console.log("Prisma client generated successfully")
} catch (error) {
  console.error("Error during database migration:", error)
  process.exit(1)
}

