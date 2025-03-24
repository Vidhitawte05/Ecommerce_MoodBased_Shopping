const { execSync } = require("child_process")

// This script is used to run Prisma migrations on Netlify
async function main() {
  try {
    console.log("Running Prisma migrations...")

    // Run Prisma migrations
    execSync("npx prisma migrate deploy", { stdio: "inherit" })

    console.log("Migrations completed successfully")

    // Optionally seed the database
    if (process.env.SEED_DB === "true") {
      console.log("Seeding the database...")
      execSync("npx prisma db seed", { stdio: "inherit" })
      console.log("Database seeded successfully")
    }

    process.exit(0)
  } catch (error) {
    console.error("Error running migrations:", error)
    process.exit(1)
  }
}

main()

