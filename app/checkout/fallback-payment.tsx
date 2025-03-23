"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface PaymentFormProps {
  amount: number
  onSuccess: (paymentId: string) => void
  onCancel: () => void
}

export function FallbackPayment({ amount, onSuccess, onCancel }: PaymentFormProps) {
  const [email, setEmail] = useState("sb-47bqhp29072292@personal.example.com")
  const [password, setPassword] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const mockPaymentId = `PAYID-${Math.random().toString(36).substring(2, 15).toUpperCase()}`

      setIsProcessing(false)
      toast({
        title: "Payment Successful",
        description: `Payment of $${amount.toFixed(2)} was successful.`,
      })

      onSuccess(mockPaymentId)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PayPal Sandbox Checkout</CardTitle>
        <CardDescription>Complete your payment of ${amount.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Use: 12345678"
            />
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
            <p>This is a sandbox payment. Use these test credentials:</p>
            <p className="mt-1">
              <strong>Email:</strong> sb-47bqhp29072292@personal.example.com
            </p>
            <p>
              <strong>Password:</strong> 12345678
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isProcessing}>
          {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
        </Button>
      </CardFooter>
    </Card>
  )
}

