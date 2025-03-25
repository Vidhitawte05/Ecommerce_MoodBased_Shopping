/**
 * Helper function to ensure image paths are correctly formatted
 * for both local development and production environments
 */
export function getImagePath(path: string): string {
  // If the path is already a full URL, return it as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  // If the path is a placeholder, return it as is
  if (path.startsWith("/placeholder.svg")) {
    return path
  }

  // Get the base URL from environment variables
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""

  // If the path already starts with a slash, remove it to avoid double slashes
  const normalizedPath = path.startsWith("/") ? path.substring(1) : path

  // For local development, just return the path
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return `/${normalizedPath}`
  }

  // For production, prepend the base URL
  return `${baseUrl}/${normalizedPath}`
}

