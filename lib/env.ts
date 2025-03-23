// Environment variables helper

// Get the app URL from environment or fallback to a default
export const getAppUrl = (): string => {
    // Check for environment variable
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL
    }
  
    // In browser, use the current origin
    if (typeof window !== "undefined") {
      return window.location.origin
    }
  
    // Fallback for server-side
    return "http://localhost:3000"
  }
  
  // Debug function to check environment variables
  export const debugEnv = () => {
    console.log("Environment variables:")
    console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL)
    console.log("NODE_ENV:", process.env.NODE_ENV)
  
    // In browser, also log the current origin
    if (typeof window !== "undefined") {
      console.log("Window origin:", window.location.origin)
    }
  
    return {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NODE_ENV: process.env.NODE_ENV,
      origin: typeof window !== "undefined" ? window.location.origin : null,
    }
  }
  

  