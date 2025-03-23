"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, User, Search, Menu, X, Sun, Moon, LogOut, ShoppingBag, Heart, Bell } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { NotificationCenter } from "@/components/notification-center"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const { setTheme } = useTheme()
  const router = useRouter()
  const { user, signOut, isAuthenticated } = useAuth()

  // This effect ensures hydration is complete before rendering auth-dependent UI
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const { cart } = useCart()
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <Link href="/" className="text-2xl font-bold text-primary">
              Moody
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6 mx-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/quiz" className="text-sm font-medium hover:text-primary">
              Mood Quiz
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary">
              Shop
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex relative flex-1 max-w-sm mx-6">
            <form onSubmit={handleSearch} className="w-full">
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {mounted && (
              <>
                {isAuthenticated ? (
                  <>
                    <NotificationCenter />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <User size={20} />
                          <span className="sr-only">Account</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-1.5">
                          <p className="text-sm font-medium">{user?.name || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/account" className="flex items-center">
                            <User size={16} className="mr-2" />
                            My Account
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account/orders" className="flex items-center">
                            <ShoppingBag size={16} className="mr-2" />
                            My Orders
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account/wishlist" className="flex items-center">
                            <Heart size={16} className="mr-2" />
                            Wishlist
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account/notifications" className="flex items-center">
                            <Bell size={16} className="mr-2" />
                            Notifications
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut} className="text-red-500 focus:text-red-500">
                          <LogOut size={16} className="mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/auth/signin">
                      <User size={20} />
                      <span className="sr-only">Sign In</span>
                    </Link>
                  </Button>
                )}
              </>
            )}

            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <div className="relative">
                  <ShoppingCart size={20} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link
                href="/quiz"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Mood Quiz
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {mounted && isAuthenticated && (
                <>
                  <Link
                    href="/account"
                    className="text-sm font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="text-sm font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="text-sm font-medium hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <button
                    className="text-sm font-medium hover:text-primary text-left flex items-center"
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

