"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signOut: () => void;
  signIn: (email: string, password: string) => Promise<boolean>; 
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/protected/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ title: "Login Failed", description: data.error || "Invalid email or password", variant: "destructive" });
        return false;
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);

      toast({ title: "Login Successful", description: `Welcome back, ${data.user.name}!` });
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({ title: "Login Failed", description: "An unexpected error occurred.", variant: "destructive" });
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ title: "Signup Failed", description: data.error || "Failed to create account", variant: "destructive" });
        return false;
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);

      toast({ title: "Signup Successful", description: `Welcome, ${data.user.name}!` });
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast({ title: "Signup Failed", description: "An unexpected error occurred.", variant: "destructive" });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const signOut = logout;

  const authContextValue = { 
    user, 
    isAuthenticated: !!user, 
    isLoading, 
    login, 
    signIn, 
    signup, 
    logout, 
    signOut 
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
