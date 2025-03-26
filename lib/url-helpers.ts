// Helper functions for URL handling

// Get the base URL for the application
export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // In the browser, use the current origin
    return window.location.origin
  }

  // In server-side code, use the environment variable or default
  return process.env.NEXT_PUBLIC_APP_URL || "https://moodyss.netlify.app/"
}

// Create a full URL from a path
export function createFullUrl(path: string): string {
  const baseUrl = getBaseUrl()

  // Ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${baseUrl}${normalizedPath}`
}

// Fix QR code URL to use the production URL instead of localhost
export function getQrCodeUrl(path: string): string {
  // Always use the production URL for QR codes
  const productionUrl = process.env.NEXT_PUBLIC_APP_URL || "https://moodyss.netlify.app"

  // Ensure path starts with a slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${productionUrl}${normalizedPath}`
}

