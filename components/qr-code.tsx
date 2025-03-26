"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode.react"
import { getQrCodeUrl } from "@/lib/url-helpers"

interface QRCodeGeneratorProps {
  value: string
  size?: number
  includeMargin?: boolean
  className?: string
}

export default function QRCodeGenerator({
  value,
  size = 128,
  includeMargin = true,
  className = "",
}: QRCodeGeneratorProps) {
  const [url, setUrl] = useState<string>(value)

  useEffect(() => {
    // Use the helper to get the correct URL for QR code
    const fullUrl = getQrCodeUrl(value)
    setUrl(fullUrl)
  }, [value])

  return (
    <div className={`bg-white p-2 rounded-md inline-block ${className}`}>
      <QRCode value={url} size={size} includeMargin={includeMargin} renderAs="svg" />
    </div>
  )
}

