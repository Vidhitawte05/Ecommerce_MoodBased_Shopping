import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative w-64 h-64 mb-8">
        <Image src="/images/404-illustration.jpg" alt="Page not found" fill className="object-contain" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-muted-foreground text-lg mb-8 text-center max-w-md">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    </div>
  )
}

