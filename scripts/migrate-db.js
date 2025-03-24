const { execSync } = require("child_process")

// This script is used to run Prisma migrations on Netlify
async function main() {
  try {
    console.log("Running Prisma migrations...")

    // Run Prisma migrations
    execSync("npx prisma migrate deploy", { stdio: "inherit" })

    console.log("Migrations completed successfully")

    // Generate Prisma client
    console.log("Generating Prisma client...")
    execSync("npx prisma generate", { stdio: "inherit" })

    console.log("Prisma client generated successfully")

    process.exit(0)
  } catch (error) {
    console.error("Error running migrations:", error)
    process.exit(1)
  }
}

main()

