"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

type PaymentMethod = {
  id: string
  cardNumber: string
  cardHolder: string
  expiryDate: string
  isDefault: boolean
}

export default function PaymentMethodsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isPaymentMethodsLoading, setIsPaymentMethodsLoading] = useState(true)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  // Form state
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push("/auth/signin")
    }
  }, [isLoading, isAuthenticated, router, mounted])

  useEffect(() => {
    if (mounted && isAuthenticated) {
      // In a real app, fetch payment methods from API
      // For now, we'll use mock data
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: "pm_1",
          cardNumber: "•••• •••• •••• 4242",
          cardHolder: "John Doe",
          expiryDate: "12/25",
          isDefault: true,
        },
      ]

      setPaymentMethods(mockPaymentMethods)
      setIsPaymentMethodsLoading(false)
    }
  }, [isAuthenticated, mounted])

  if (!mounted || isLoading || isPaymentMethodsLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <div className="container mx-auto px-4 py-12 text-center">Please sign in to view your payment methods.</div>
  }

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would send this to your API
    const newPaymentMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      cardNumber: `•••• •••• •••• ${cardNumber.slice(-4)}`,
      cardHolder,
      expiryDate,
      isDefault: paymentMethods.length === 0,
    }

    setPaymentMethods([...paymentMethods, newPaymentMethod])

    // Reset form
    setCardNumber("")
    setCardHolder("")
    setExpiryDate("")
    setCvv("")

    setIsDialogOpen(false)

    toast({
      title: "Payment method added",
      description: "Your payment method has been added successfully.",
    })
  }

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id))

    toast({
      title: "Payment method removed",
      description: "Your payment method has been removed.",
    })
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )

    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Payment Methods</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Add a new credit or debit card to your account.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddPaymentMethod} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardHolder">Card Holder Name</Label>
                <Input
                  id="cardHolder"
                  placeholder="John Doe"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Add Payment Method</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {paymentMethods.length > 0 ? (
        <div className="space-y-6">
          {paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CreditCard size={20} className="mr-2 text-primary" />
                    <CardTitle className="text-lg">{method.cardNumber}</CardTitle>
                  </div>
                  {method.isDefault && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Default</span>
                  )}
                </div>
                <CardDescription>{method.cardHolder}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Expires: {method.expiryDate}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleRemovePaymentMethod(method.id)}>
                  <Trash2 size={16} className="mr-2" />
                  Remove
                </Button>

                {!method.isDefault && (
                  <Button variant="secondary" size="sm" onClick={() => handleSetDefault(method.id)}>
                    Set as Default
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">You don't have any payment methods yet.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

