"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle } from "lucide-react"

function PaymentRedirectContent() {
  const router = useRouter()
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [message, setMessage] = useState("Processing your payment...")
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [amount, setAmount] = useState<string | null>(null)

  useEffect(() => {
    // Get query parameters from URL
    const params = new URLSearchParams(window.location.search)
    const paymentIdParam = params.get("paymentId")
    const amountParam = params.get("amount")

    setPaymentId(paymentIdParam)
    setAmount(amountParam)

    if (!paymentIdParam || !amountParam) {
      setStatus("error")
      setMessage("Invalid payment information. Please try again.")
      return
    }

    const processPayment = async () => {
      try {
        // In a real app, you would verify the payment with your payment provider
        // For this demo, we'll simulate a successful payment after a short delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simulate a successful payment
        setStatus("success")
        setMessage("Payment successful! You will be redirected to the order confirmation page.")

        // Notify the parent window if this was opened from a QR code
        if (window.opener) {
          try {
            window.opener.postMessage(
              {
                type: "PAYMENT_COMPLETE",
                paymentId: paymentIdParam,
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
      } catch (error) {
        console.error("Payment processing error:", error)
        setStatus("error")
        setMessage("Failed to process payment. Please try again.")
      }
    }

    processPayment()
  }, [router])

  return (
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
  )
}

export default function PaymentRedirectPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Suspense fallback={<div>Loading payment details...</div>}>
        <PaymentRedirectContent />
      </Suspense>
    </div>
  )
}

