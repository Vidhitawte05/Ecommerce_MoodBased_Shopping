import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck, Package, ArrowLeft, ArrowRight, Info, Clock } from 'lucide-react'
import Link from "next/link"

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Shipping & Returns</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Information about our shipping methods, delivery times, and return policies.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Truck className="h-6 w-6 text-primary" />
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Shipping Methods</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">Standard Shipping</p>
                    <p className="text-sm text-muted-foreground">3-5 business days</p>
                  </div>
                  <div>
                    <p className="font-medium">$5.99</p>
                    <p className="text-sm text-green-600">Free over $35</p>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">Express Shipping</p>
                    <p className="text-sm text-muted-foreground">1-2 business days</p>
                  </div>
                  <p className="font-medium">$12.99</p>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">Overnight Shipping</p>
                    <p className="text-sm text-muted-foreground">Next business day</p>
                  </div>
                  <p className="font-medium">$19.99</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-lg">International Shipping</h3>
              <p>
                We ship to most countries worldwide. International shipping times typically range from 7-14 business days, depending on location and customs processing.
              </p>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">International Standard</p>
                  <p className="text-sm text-muted-foreground">7-14 business days</p>
                </div>
                <p className="font-medium">$14.99</p>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium">International Express</p>
                  <p className="text-sm text-muted-foreground">3-5 business days</p>
                </div>
                <p className="font-medium">$29.99</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Note: Additional customs fees and import duties may apply depending on your country's regulations.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <ArrowLeft className="h-6 w-6 text-primary" />
            <CardTitle>Returns & Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Return Policy</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span><strong>30-Day Return Window:</strong> Items can be returned within 30 days of delivery.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span><strong>Condition Requirements:</strong> Items must be unused, in original packaging, and in the same condition you received them.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span><strong>Non-Returnable Items:</strong> Certain products cannot be returned due to health and hygiene reasons, including personal care items that have been opened.</span>
                </li>
              </ul>
              
              <h3 className="font-semibold text-lg mt-6">Refund Process</h3>
              <ol className="space-y-2 list-decimal list-inside">
                <li><strong>Initiate your return</strong> through your account or by contacting customer service.</li>
                <li><strong>Ship your items back</strong> using our prepaid return label.</li>
                <li><strong>We'll inspect the returned items</strong> (typically within 2-3 business days of receipt).</li>
                <li><strong>Refund will be processed</strong> to your original payment method.</li>
              </ol>
              
              <p className="text-sm text-muted-foreground mt-2">
                Refunds typically take 5-10 business days to appear in your account, depending on your payment method and financial institution.
              </p>
              
              <h3 className="font-semibold text-lg mt-6">Exchanges</h3>
              <p>
                We're happy to exchange items of equal value. For items of different values, we'll refund the original purchase and you can place a new order.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted p-6 rounded-lg max-w-3xl mx-auto mb-8">
        <h3 className="text-xl font-semibold mb-4">Shipping FAQ</h3>
        <div className="space-y-4">
          <div>
            <p className="font-medium">How can I track my order?</p>
            <p className="text-muted-foreground">
              Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order from your account page or by visiting the Track Your Order page.
            </p>
          </div>
          <div>
            <p className="font-medium">Do you ship to P.O. boxes?</p>
            <p className="text-muted-foreground">
              Yes, we ship to P.O. boxes for standard shipping only. Express and overnight shipping require a physical address.
            </p>
          </div>
          <div>
            <p className="font-medium">What if my package is damaged upon arrival?</p>
            <p className="text-muted-foreground">
              Please contact our customer service team immediately with photos of the damaged packaging and products. We'll arrange a replacement or refund.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="mb-4">
          Have more questions about shipping or returns?
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/faq">View FAQ</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
