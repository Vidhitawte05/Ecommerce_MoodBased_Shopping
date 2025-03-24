"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function PaymentRedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [message, setMessage] = useState("Processing your payment...")

  const paymentId = searchParams?.get("paymentId") ?? ""; // Default to an empty string
  const amount = searchParams?.get("amount") ?? "0"; 

  useEffect(() => {
    if (!paymentId || !amount) {
      setStatus("error")
      setMessage("Invalid payment information. Please try again.")
      return
    }

    // Simulate payment processing
    const timer = setTimeout(() => {
      // In a real app, you would verify the payment with your payment provider
      setStatus("success")
      setMessage("Payment successful! You will be redirected to the order confirmation page.")

      // Notify the parent window if this was opened from a QR code
      if (window.opener) {
        try {
          window.opener.postMessage(
            {
              type: "PAYMENT_COMPLETE",
              paymentId,
              success: true,
            },
            "*",
          )
        } catch (e) {
          console.error("Failed to communicate with parent window:", e)
        }
      }

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/order-confirmation")
      }, 2000)
    }, 2000)

    return () => clearTimeout(timer)
  }, [paymentId, amount, router])

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === "processing" && "Processing Payment"}
            {status === "success" && (
              <>
                <CheckCircle className="text-green-500" size={20} />
                Payment Successful
              </>
            )}
            {status === "error" && (
              <>
                <AlertCircle className="text-red-500" size={20} />
                Payment Error
              </>
            )}
          </CardTitle>
          <CardDescription>
            {paymentId && `Payment ID: ${paymentId}`}
            {amount && ` • Amount: $${amount}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-center py-6 ${status === "processing" ? "animate-pulse" : ""}`}>
            <p>{message}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === "error" && <Button onClick={() => router.push("/checkout")}>Return to Checkout</Button>}
        </CardFooter>
      </Card>
    </div>
  )
}

