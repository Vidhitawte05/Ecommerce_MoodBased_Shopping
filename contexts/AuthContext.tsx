"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signIn?: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          setUser(null)
          setIsLoading(false)
          return
        }

        const response = await fetch("/api/protected/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          // Token is invalid or expired
          localStorage.removeItem("token")
          localStorage.removeItem("userId")
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid email or password",
          variant: "destructive",
        })
        return false
      }

      // Store token and user data
      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.user.id)
      setUser(data.user)

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.name}!`,
      })

      return true
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "Signup Failed",
          description: data.error || "Failed to create account",
          variant: "destructive",
        })
        return false
      }

      // Store token and user data
      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.user.id)
      setUser(data.user)

      toast({
        title: "Signup Successful",
        description: `Welcome, ${data.user.name}!`,
      })

      return true
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    setUser(null)

    // Clear any user-specific data from localStorage
    localStorage.removeItem("cart")
    localStorage.removeItem("lastOrderDetails")
    localStorage.removeItem("userOrders")

    router.push("/")

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

