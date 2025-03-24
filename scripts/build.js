const { execSync } = require("child_process")

// This script is used to build the application on Netlify
async function main() {
  try {
    console.log("Installing dependencies...")
    execSync("npm install", { stdio: "inherit" })

    console.log("Generating Prisma client...")
    execSync("npx prisma generate", { stdio: "inherit" })

    console.log("Building Next.js application...")
    execSync("next build", { stdio: "inherit" })

    console.log("Build completed successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error during build:", error)
    process.exit(1)
  }
}

main()

