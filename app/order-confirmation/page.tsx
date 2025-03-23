"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Printer, Download, CheckCircle, Package, Truck, Home } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"

export default function OrderConfirmationPage() {
  const [orderNumber, setOrderNumber] = useState<string>("")
  const [orderDate, setOrderDate] = useState<string>("")
  const { cart, clearCart } = useCart()
  const [orderItems, setOrderItems] = useState(cart)
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [shippingAddress, setShippingAddress] = useState<any>(null)
  const [billingAddress, setBillingAddress] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("")

  useEffect(() => {
    setMounted(true)

    // Try to get order details from localStorage
    const storedOrderDetails = localStorage.getItem("lastOrderDetails")
    if (storedOrderDetails) {
      try {
        const orderDetails = JSON.parse(storedOrderDetails)
        setOrderNumber(orderDetails.orderId || `MOD-${Math.floor(100000 + Math.random() * 900000)}`)
        setOrderDate(orderDetails.orderDate || new Date().toLocaleDateString())
        setShippingAddress(orderDetails.shippingAddress || null)
        setBillingAddress(orderDetails.billingAddress || null)
        setPaymentMethod(orderDetails.paymentMethod || "")

        // If we have stored order items, use those instead of the cart
        if (orderDetails.orderItems && orderDetails.orderItems.length > 0) {
          setOrderItems(orderDetails.orderItems)
        } else if (cart.length > 0) {
          // Store the cart items for the order confirmation
          setOrderItems([...cart])
          // Clear the cart after storing the items
          clearCart()
        }

        // Store the order in localStorage for persistence
        if (orderNumber && orderDate) {
          try {
            // Get existing orders
            const existingOrdersJson = localStorage.getItem("userOrders")
            let existingOrders = existingOrdersJson ? JSON.parse(existingOrdersJson) : []

            // Add this order if it doesn't exist
            const orderExists = existingOrders.some((order: any) => order.id === orderNumber)

            if (!orderExists) {
              const newOrder = {
                id: orderNumber,
                date: orderDate,
                total: total,
                status: "pending",
                items: orderItems.length,
              }

              existingOrders = [newOrder, ...existingOrders]
              localStorage.setItem("userOrders", JSON.stringify(existingOrders))
            }
          } catch (error) {
            console.error("Error saving order to localStorage:", error)
          }
        }
      } catch (error) {
        console.error("Error parsing stored order details:", error)
        setDefaultOrderInfo()
      }
    } else {
      setDefaultOrderInfo()
    }
  }, [])

  const setDefaultOrderInfo = () => {
    setOrderNumber(`MOD-${Math.floor(100000 + Math.random() * 900000)}`)
    setOrderDate(new Date().toLocaleDateString())

    // Store the cart items for the order confirmation
    if (cart.length > 0) {
      setOrderItems([...cart])
      // Clear the cart after storing the items
      clearCart()
    }
  }

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 35 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handlePrintInvoice = () => {
    window.print()
  }

  const handleDownloadInvoice = () => {
    toast({
      title: "Invoice Downloaded",
      description: "Your invoice has been downloaded successfully.",
    })
  }

  if (!mounted) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <Card className="mb-8 print:shadow-none">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Order #{orderNumber}</CardTitle>
                <CardDescription>Placed on {orderDate}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
                  <Printer size={16} className="mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-4">
                  {orderItems.length > 0 ? (
                    orderItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div>${item.price.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No items in this order.</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Shipping Address</h3>
                  <div className="text-sm">
                    {shippingAddress ? (
                      <>
                        <p>
                          {shippingAddress.firstName} {shippingAddress.lastName}
                        </p>
                        <p>{shippingAddress.address}</p>
                        <p>
                          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                        </p>
                        <p>{shippingAddress.country}</p>
                        <p className="mt-2">Email: {shippingAddress.email}</p>
                        <p>Phone: {shippingAddress.phone}</p>
                      </>
                    ) : (
                      <>
                        <p>John Doe</p>
                        <p>123 Main Street</p>
                        <p>Apt 4B</p>
                        <p>New York, NY 10001</p>
                        <p>United States</p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Billing Address</h3>
                  <div className="text-sm">
                    {billingAddress ? (
                      <>
                        <p>
                          {billingAddress.firstName} {billingAddress.lastName}
                        </p>
                        <p>{billingAddress.address}</p>
                        <p>
                          {billingAddress.city}, {billingAddress.state} {billingAddress.zip}
                        </p>
                        <p>{billingAddress.country}</p>
                      </>
                    ) : (
                      <>
                        <p>Same as shipping address</p>
                      </>
                    )}
                  </div>

                  <h3 className="font-semibold mb-4 mt-6">Payment Information</h3>
                  <div className="text-sm">
                    <p>
                      Payment Method:{" "}
                      {paymentMethod
                        ? paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : paymentMethod === "paypal"
                            ? "PayPal"
                            : paymentMethod
                        : "Credit Card"}
                    </p>
                    <p>Email: {shippingAddress?.email || "john.doe@example.com"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Totals */}
              <div>
                <div className="space-y-2">
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Tracking */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Track Your Order</CardTitle>
            <CardDescription>
              Your order is currently being processed. You will receive an email with tracking information once your
              order ships.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 text-center">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto">
                    <CheckCircle size={16} />
                  </div>
                  <div className="mt-2 text-sm font-medium">Order Placed</div>
                  <div className="text-xs text-muted-foreground">{orderDate}</div>
                </div>

                <div className="flex-1 text-center">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                    <Package size={16} />
                  </div>
                  <div className="mt-2 text-sm font-medium">Processing</div>
                  <div className="text-xs text-muted-foreground">Estimated: 1-2 days</div>
                </div>

                <div className="flex-1 text-center">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                    <Truck size={16} />
                  </div>
                  <div className="mt-2 text-sm font-medium">Shipped</div>
                  <div className="text-xs text-muted-foreground">-</div>
                </div>

                <div className="flex-1 text-center">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                    <Home size={16} />
                  </div>
                  <div className="mt-2 text-sm font-medium">Delivered</div>
                  <div className="text-xs text-muted-foreground">-</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted">
                <div className="h-full bg-primary" style={{ width: "12.5%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">What's Next?</h3>
          <p className="text-muted-foreground">
            You will receive an email confirmation with your order details and tracking information once your order
            ships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/account/orders">View All Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

