"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { AlertCircle, CreditCard, Banknote } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useNotifications } from "@/contexts/NotificationContext"
import { PayPalButton } from "@/components/paypal-button"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("paypal")
  const [isProcessing, setIsProcessing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [billingAddressType, setBillingAddressType] = useState("same")
  const [showBillingFields, setShowBillingFields] = useState(false)
  const [showPayPalButton, setShowPayPalButton] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { cart, clearCart } = useCart()
  const { isAuthenticated, isLoading, user } = useAuth()
  const { addNotification } = useNotifications()

  // Form state for shipping
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [country, setCountry] = useState("us")

  // Form state for billing (when different)
  const [billingFirstName, setBillingFirstName] = useState("")
  const [billingLastName, setBillingLastName] = useState("")
  const [billingAddress, setBillingAddress] = useState("")
  const [billingCity, setBillingCity] = useState("")
  const [billingState, setBillingState] = useState("")
  const [billingZip, setBillingZip] = useState("")
  const [billingCountry, setBillingCountry] = useState("us")

  useEffect(() => {
    setMounted(true)

    // Pre-fill email if user is logged in
    if (user) {
      setEmail(user.email || "")
      const nameParts = user.name?.split(" ") || []
      setFirstName(nameParts[0] || "")
      setLastName(nameParts.slice(1).join(" ") || "")
    }

    // Check for payment method in URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const paymentParam = urlParams.get("payment")
      if (paymentParam && (paymentParam === "paypal" || paymentParam === "cod")) {
        setPaymentMethod(paymentParam)
      }
    }
  }, [user])

  // Handle billing address type change
  useEffect(() => {
    setShowBillingFields(billingAddressType === "different")

    // If switching to "same", copy shipping to billing
    if (billingAddressType === "same") {
      setBillingFirstName(firstName)
      setBillingLastName(lastName)
      setBillingAddress(address)
      setBillingCity(city)
      setBillingState(state)
      setBillingZip(zip)
      setBillingCountry(country)
    }
  }, [billingAddressType, firstName, lastName, address, city, state, zip, country])

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 35 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const validateForm = () => {
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zip) {
      setPaymentError("Please fill in all required shipping fields")
      return false
    }

    if (billingAddressType === "different") {
      if (!billingFirstName || !billingLastName || !billingAddress || !billingCity || !billingState || !billingZip) {
        setPaymentError("Please fill in all required billing fields")
        return false
      }
    }

    setPaymentError(null)
    return true
  }

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    if (paymentMethod === "paypal") {
      setShowPayPalButton(true)
    } else if (paymentMethod === "cod") {
      handleProcessOrder(null)
    }
  }

  const handlePayPalSuccess = (details: any) => {
    console.log("PayPal payment successful:", details)
    handleProcessOrder(details)
  }

  const handlePayPalError = (error: any) => {
    console.error("PayPal payment error:", error)
    setPaymentError("Payment failed. Please try again or choose a different payment method.")
    setIsProcessing(false)
  }

  // Process order after payment
  const handleProcessOrder = async (paymentDetails: any) => {
    setIsProcessing(true)
    try {
      if (!user) {
        throw new Error("You must be signed in to place an order")
      }

      // Create shipping address object
      const shippingAddress = {
        firstName,
        lastName,
        email,
        phone,
        street: address,
        city,
        state,
        postalCode: zip,
        country,
      }

      // Create billing address object if different
      const billingAddressData =
        billingAddressType === "different"
          ? {
              firstName: billingFirstName,
              lastName: billingLastName,
              street: billingAddress,
              city: billingCity,
              state: billingState,
              postalCode: billingZip,
              country: billingCountry,
            }
          : shippingAddress

      // Generate a unique order ID
      const orderId = `ORD-${Date.now().toString().slice(-6)}`

      // Create order items from cart
      const orderItems = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      // Create order object
      const order = {
        id: orderId,
        userId: user.id,
        items: orderItems,
        total: total,
        status: "processing",
        shippingAddress,
        billingAddress: billingAddressData,
        paymentMethod,
        paymentId: paymentDetails?.id || null,
        createdAt: new Date().toISOString(),
      }

      // Save order to API
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      const data = await response.json()

      // Store order details for confirmation page
      localStorage.setItem(
        "lastOrderDetails",
        JSON.stringify({
          orderId: data.order.id,
          orderDate: new Date().toLocaleDateString(),
          orderItems: cart,
          shippingAddress,
          paymentMethod,
          paymentDetails: paymentDetails
            ? {
                id: paymentDetails.id,
                status: paymentDetails.status,
                email: paymentDetails.payer?.email_address,
              }
            : null,
        }),
      )

      // Add notification
      addNotification({
        title: "Order Placed Successfully",
        message: `Your order #${data.order.id} has been placed and is being processed.`,
        type: "success",
      })

      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${data.order.id} has been placed.`,
      })

      // Clear cart and redirect to confirmation
      clearCart()
      router.push("/order-confirmation")
    } catch (error) {
      console.error("Order processing error:", error)
      setPaymentError(error instanceof Error ? error.message : "Failed to process order")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!mounted || isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <p className="text-muted-foreground mb-6">Please sign in to continue with checkout.</p>
        <Button asChild>
          <Link href={`/auth/signin?redirect=${encodeURIComponent("/checkout")}`}>Sign In</Link>
        </Button>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <p className="text-muted-foreground mb-4">
          Your cart is empty. Add some products to your cart before checking out.
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {paymentError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{paymentError}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleContinueToPayment}>
            <div className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">Postal Code</Label>
                    <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="in">India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                <div className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        PayPal / Credit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Cash on Delivery
                      </Label>
                    </div>
                  </RadioGroup>

                  {showPayPalButton && paymentMethod === "paypal" ? (
                    <div className="mt-4 p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-4">Pay with PayPal or Credit Card</h3>
                      <PayPalButton amount={total} onSuccess={handlePayPalSuccess} onError={handlePayPalError} />
                    </div>
                  ) : (
                    <div className="mt-4 p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-4">
                        {paymentMethod === "paypal" ? "Pay with PayPal or Credit Card" : "Cash on Delivery"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {paymentMethod === "paypal"
                          ? "You'll be able to enter your payment details in the next step."
                          : "Pay with cash when your order is delivered."}
                      </p>
                      <Button className="w-full" type="submit" disabled={isProcessing}>
                        {isProcessing
                          ? "Processing..."
                          : paymentMethod === "paypal"
                            ? "Continue to Payment"
                            : "Place Order"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Billing Address</h2>

                <div className="space-y-4">
                  <RadioGroup value={billingAddressType} onValueChange={setBillingAddressType}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="same" id="same" />
                      <Label htmlFor="same">Same as shipping address</Label>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <RadioGroupItem value="different" id="different" />
                      <Label htmlFor="different">Use a different billing address</Label>
                    </div>
                  </RadioGroup>

                  {showBillingFields && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="billingFirstName">First Name</Label>
                        <Input
                          id="billingFirstName"
                          value={billingFirstName}
                          onChange={(e) => setBillingFirstName(e.target.value)}
                          required={showBillingFields}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingLastName">Last Name</Label>
                        <Input
                          id="billingLastName"
                          value={billingLastName}
                          onChange={(e) => setBillingLastName(e.target.value)}
                          required={showBillingFields}
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="billingAddress">Street Address</Label>
                        <Input
                          id="billingAddress"
                          value={billingAddress}
                          onChange={(e) => setBillingAddress(e.target.value)}
                          required={showBillingFields}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingCity">City</Label>
                        <Input
                          id="billingCity"
                          value={billingCity}
                          onChange={(e) => setBillingCity(e.target.value)}
                          required={showBillingFields}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingState">State/Province</Label>
                        <Input
                          id="billingState"
                          value={billingState}
                          onChange={(e) => setBillingState(e.target.value)}
                          required={showBillingFields}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingZip">Postal Code</Label>
                        <Input
                          id="billingZip"
                          value={billingZip}
                          onChange={(e) => setBillingZip(e.target.value)}
                          required={showBillingFields}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingCountry">Country</Label>
                        <Select value={billingCountry} onValueChange={setBillingCountry}>
                          <SelectTrigger id="billingCountry">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="in">India</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-card rounded-lg border p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                    <div>${item.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              By placing your order, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

