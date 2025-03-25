"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PayPalButtonProps {
  amount: number
  currency?: string
  onSuccess: (details: any) => void
  onError?: (error: any) => void
  onCancel?: () => void
}

declare global {
  interface Window {
    paypal?: any
  }
}

export function PayPalButton({ amount, currency = "USD", onSuccess, onError, onCancel }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isButtonRendered, setIsButtonRendered] = useState(false)
  const [scriptError, setScriptError] = useState<string | null>(null)
  const [fallbackMode, setFallbackMode] = useState(false)

  // Load the PayPal SDK script
  useEffect(() => {
    const loadPayPalScript = () => {
      // Check if the script is already loaded
      if (window.paypal) {
        setIsScriptLoaded(true)
        setIsLoading(false)
        return
      }

      // Get the client ID from environment variables
      const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

      if (!clientId) {
        console.error("PayPal client ID is not defined")
        setScriptError("PayPal configuration is missing. Please contact support.")
        setIsLoading(false)
        setFallbackMode(true)
        return
      }

      // Create script element
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`
      script.async = true

      script.onload = () => {
        console.log("PayPal script loaded successfully")
        setIsScriptLoaded(true)
        setIsLoading(false)
      }

      script.onerror = (error) => {
        console.error("Failed to load PayPal SDK:", error)
        setScriptError("Failed to load PayPal. Please try again later.")
        setIsLoading(false)
        setFallbackMode(true)
        if (onError) onError(new Error("Failed to load PayPal SDK"))
      }

      document.body.appendChild(script)

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }

    loadPayPalScript()
  }, [currency, onError])

  // Render the PayPal button
  useEffect(() => {
    if (isScriptLoaded && paypalRef.current && !isButtonRendered && window.paypal) {
      try {
        window.paypal
          .Buttons({
            createOrder: (data: any, actions: any) => {
              console.log("Creating PayPal order for amount:", amount)
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount.toFixed(2),
                    },
                  },
                ],
              })
            },
            onApprove: async (data: any, actions: any) => {
              console.log("PayPal payment approved:", data)
              try {
                const details = await actions.order.capture()
                console.log("Payment completed successfully:", details)
                onSuccess(details)
              } catch (error) {
                console.error("Error capturing PayPal order:", error)
                if (onError) onError(error)
              }
            },
            onCancel: (data: any) => {
              console.log("PayPal payment cancelled:", data)
              if (onCancel) onCancel()
            },
            onError: (err: any) => {
              console.error("PayPal error:", err)
              if (onError) onError(err)
            },
            style: {
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal",
            },
          })
          .render(paypalRef.current)
          .then(() => {
            console.log("PayPal button rendered successfully")
            setIsButtonRendered(true)
          })
          .catch((error: any) => {
            console.error("Error rendering PayPal button:", error)
            setScriptError("Error rendering PayPal button. Please try again.")
            setFallbackMode(true)
            if (onError) onError(error)
          })
      } catch (error) {
        console.error("Error setting up PayPal button:", error)
        setScriptError("Error setting up PayPal. Please try again.")
        setFallbackMode(true)
        if (onError) onError(error)
      }
    }
  }, [isScriptLoaded, amount, currency, onSuccess, onError, onCancel, isButtonRendered])

  // Fallback payment handler
  const handleFallbackPayment = async () => {
    try {
      setIsLoading(true)

      // Simulate payment processing
      const response = await fetch("/api/paypal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency,
          paymentMethod: "paypal_fallback",
        }),
      })

      if (!response.ok) {
        throw new Error("Payment processing failed")
      }

      const data = await response.json()
      onSuccess(data.payment)
    } catch (error) {
      console.error("Fallback payment error:", error)
      if (onError) onError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : scriptError ? (
        <div className="space-y-4">
          <div className="text-center py-2 text-red-500">
            <p>{scriptError}</p>
          </div>

          {fallbackMode && (
            <div className="space-y-2">
              <p className="text-sm text-center">Continue with alternative payment method:</p>
              <Button onClick={handleFallbackPayment} className="w-full" variant="default">
                Pay ${amount.toFixed(2)} with PayPal
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div ref={paypalRef} className="w-full"></div>
      )}
    </div>
  )
}

