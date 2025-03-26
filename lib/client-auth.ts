// Helper functions for client-side authentication

// Store token in localStorage
export function storeAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

// Get token from localStorage
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Remove token from localStorage
export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
  }
}

// Add token to fetch request headers
export function addAuthHeader(headers: HeadersInit = {}): HeadersInit {
  const token = getAuthToken()
  if (!token) return headers

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  }
}

// Helper function to make authenticated API requests
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("No authentication token found")
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

// Helper to get the base URL for API requests
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    // In the browser, use the current origin
    return `${window.location.origin}/api`
  }

  // In server-side code, use the environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
}

