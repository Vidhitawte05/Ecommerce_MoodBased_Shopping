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

  // Load the PayPal SDK script
  useEffect(() => {
    const loadPayPalScript = () => {
      // Check if the script is already loaded
      if (window.paypal) {
        setIsScriptLoaded(true)
        setIsLoading(false)
        return
      }

      // Create script element
      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb"}&currency=${currency}`
      script.async = true

      script.onload = () => {
        setIsScriptLoaded(true)
        setIsLoading(false)
      }

      script.onerror = () => {
        console.error("Failed to load PayPal SDK")
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
    if (isScriptLoaded && paypalRef.current && !isButtonRendered) {
      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
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
            const details = await actions.order.capture()
            onSuccess(details)
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

      setIsButtonRendered(true)
    }
  }, [isScriptLoaded, amount, currency, onSuccess, onError, isButtonRendered])

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div ref={paypalRef} className="w-full"></div>
      )}
    </div>
  )
}

