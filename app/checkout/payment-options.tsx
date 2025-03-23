"use client"

import type React from "react"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Smartphone } from "lucide-react"

interface PaymentOptionsProps {
  onSelectPaymentMethod: (method: string, details?: any) => void
  isProcessing: boolean
}

export function PaymentOptions({ onSelectPaymentMethod, isProcessing }: PaymentOptionsProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [upiId, setUpiId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "credit_card" || paymentMethod === "debit_card") {
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        alert("Please fill in all card details")
        return
      }

      onSelectPaymentMethod(paymentMethod, {
        cardNumber,
        cardHolder,
        expiryDate,
        cvv,
      })
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        alert("Please enter your UPI ID")
        return
      }

      onSelectPaymentMethod(paymentMethod, { upiId })
    } else {
      onSelectPaymentMethod(paymentMethod)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="credit_card" id="credit_card" />
          <Label htmlFor="credit_card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Credit Card (PayPal)
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="debit_card" id="debit_card" />
          <Label htmlFor="debit_card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Debit Card (PayPal)
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <RadioGroupItem value="upi" id="upi" />
          <Label htmlFor="upi" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            UPI (PayPal)
          </Label>
        </div>
      </RadioGroup>

      {(paymentMethod === "credit_card" || paymentMethod === "debit_card") && (
        <Card className="mt-4">
          <CardContent className="pt-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                disabled={isProcessing}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="card-holder">Card Holder Name</Label>
              <Input
                id="card-holder"
                placeholder="John Doe"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input
                  id="expiry-date"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  maxLength={5}
                  disabled={isProcessing}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength={3}
                  type="password"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {paymentMethod === "upi" && (
        <Card className="mt-4">
          <CardContent className="pt-4">
            <div className="grid gap-2">
              <Label htmlFor="upi-id">UPI ID</Label>
              <Input
                id="upi-id"
                placeholder="name@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                disabled={isProcessing}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Button type="submit" className="w-full mt-6" disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Continue to Payment"}
      </Button>
    </form>
  )
}

