"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface PayPalButtonProps {
  amount: number
  currency?: string
  onSuccess: (details: any) => void
  onError?: (error: any) => void
}

declare global {
  interface Window {
    paypal?: any
  }
}

export function PayPalButton({ amount, currency = "USD", onSuccess, onError }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [isButtonRendered, setIsButtonRendered] = useState(false)
  const [scriptError, setScriptError] = useState<string | null>(null)

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
            if (onError) onError(error)
          })
      } catch (error) {
        console.error("Error setting up PayPal button:", error)
        setScriptError("Error setting up PayPal. Please try again.")
        if (onError) onError(error)
      }
    }
  }, [isScriptLoaded, amount, currency, onSuccess, onError, isButtonRendered])

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : scriptError ? (
        <div className="text-center py-4 text-red-500">
          <p>{scriptError}</p>
          <p className="text-sm mt-2">Please try an alternative payment method.</p>
        </div>
      ) : (
        <div ref={paypalRef} className="w-full"></div>
      )}
    </div>
  )
}

