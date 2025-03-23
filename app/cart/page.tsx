"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, CreditCard } from "lucide-react"
import { useCart } from "@/contexts/CartContext"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: number) => {
    removeFromCart(id)
  }

  const applyPromoCode = () => {
    if (promoCode.trim() === "MOOD10") {
      setPromoApplied(true)
    }
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = promoApplied ? subtotal * 0.1 : 0
  const shipping = subtotal > 35 ? 0 : 5.99
  const total = subtotal - discount + shipping

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-card rounded-lg border p-6">
              <div className="hidden md:grid grid-cols-12 gap-4 mb-6 text-sm font-medium text-muted-foreground">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <Separator className="mb-6 md:hidden" />

              {cart.map((item) => (
                <div key={item.id} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <Link href={`/products/${item.id}`} className="font-medium hover:underline">
                          {item.name}
                        </Link>
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <div className="md:hidden text-sm text-muted-foreground">Price:</div>${item.price.toFixed(2)}
                    </div>

                    <div className="col-span-2">
                      <div className="md:hidden text-sm text-muted-foreground mb-1">Quantity:</div>
                      <div className="flex items-center justify-center border rounded-md max-w-[120px] mx-auto">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-12 h-8 text-center border-0"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="col-span-2 text-right flex items-center justify-between md:justify-end gap-2">
                      <div className="md:hidden text-sm text-muted-foreground">Total:</div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                  <Separator className="mt-6" />
                </div>
              ))}

              <div className="flex justify-between mt-6">
                <Button variant="outline" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-card rounded-lg border p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                  <Button variant="outline" onClick={applyPromoCode} disabled={promoApplied}>
                    Apply
                  </Button>
                </div>

                {promoApplied && <div className="text-sm text-green-600">Promo code MOOD10 applied successfully!</div>}
              </div>

              <div className="space-y-4">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">
                    <CreditCard size={18} className="mr-2" />
                    Proceed to Checkout
                  </Link>
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Secure checkout with Razorpay and PayPal
                </div>

                <div className="flex justify-center gap-4">
                  <img src="/placeholder.svg?height=30&width=50" alt="Razorpay" className="h-8" />
                  <img src="/placeholder.svg?height=30&width=50" alt="PayPal" className="h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 space-y-6">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Looks like you haven't added any products to your cart yet. Discover products that match your mood!
          </p>
          <Button size="lg" asChild>
            <Link href="/quiz">Take the Mood Quiz</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

