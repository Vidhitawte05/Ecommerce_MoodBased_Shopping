"use client"

// This is a simplified version of the toast component
import { useState } from "react"

type ToastProps = {
  title?: string
  description?: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts([...toasts, props])

    // Remove toast after 3 seconds
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((_, i) => i !== 0))
    }, 3000)
  }

  return { toast, toasts }
}

