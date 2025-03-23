import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, CircleHelp } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Return, Refund & Exchange Policy</h1>
          <p className="text-muted-foreground">
            Last Updated: October 1, 2023
          </p>
        </div>
        
        <div className="mb-8">
          <p className="text-lg mb-6">
            At Moody, we want you to be completely satisfied with your purchase. If for any reason you're not happy with your order,
            we offer a simple and customer-friendly return, refund, and exchange process.
          </p>
          
          <div className="bg-muted p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Return Policy Overview</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>30-Day Return Window:</strong> Items can be returned within 30 days of delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Condition Requirements:</strong> Items must be unused, in original packaging, and in the same condition you received them.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Return Options:</strong> You can receive a full refund, store credit, or exchange for another item.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Return Shipping:</strong> Customers are responsible for return shipping costs unless the item is defective or we made an error.</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-semibold">How to Initiate a Return</h2>
          <ol className="space-y-4 list-decimal list-inside">
            <li>
              <strong>Log into your account</strong> and navigate to your order history.
            </li>
            <li>
              <strong>Find the order</strong> containing the item(s) you wish to return and select "Return Items."
            </li>
            <li>
              <strong>Select the item(s)</strong> you want to return and provide a reason for the return.
            </li>
            <li>
              <strong>Choose your preferred return method:</strong> refund, store credit, or exchange.
            </li>
            <li>
              <strong>Print the return label</strong> (if provided) and packing slip.
            </li>
            <li>
              <strong>Pack the item(s)</strong> securely in their original packaging if possible.
            </li>
            <li>
              <strong>Attach the return label</strong> to the outside of the package and drop it off at the specified carrier location.
            </li>
          </ol>
          
          <p>
            If you don't have an account or prefer not to use the online return process, please contact our customer service team
            at <a href="mailto:returns@moody.com" className="text-primary hover:underline">returns@moody.com</a> or call <a href="tel:+18001234567" className="text-primary hover:underline">+1 (800) 123-4567</a>.
          </p>
        </div>
        
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-semibold">Refund Process</h2>
          <p>
            Once we receive and inspect your return, we'll send you an email to notify you that we've received your returned item.
            We'll also notify you of the approval or rejection of your refund.
          </p>
          <p>
            If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment
            within 3-5 business days. Please note that it may take an additional 5-10 business days for the refund to appear in your account,
            depending on your payment provider.
          </p>
          
          <h3 className="text-xl font-semibold mt-6">Refund Timeframes</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Credit/Debit Cards:</strong> 5-10 business days after processing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>PayPal/Razorpay:</strong> 2-3 business days after processing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Store Credit:</strong> Immediately available after processing</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-semibold">Exchange Policy</h2>
          <p>
            If you'd like to exchange an item for a different color, size, or model, you can request an exchange
            instead of a refund when initiating your return. If the exchanged item has a different price:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>If the new item costs more, you'll be charged the difference.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>If the new item costs less, you'll receive a refund for the difference.</span>
            </li>
          </ul>
          <p>
            Exchange shipping is free for your first exchange. Additional exchanges for the same order may incur shipping fees.
          </p>
        </div>
        
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-semibold">Non-Returnable Items</h2>
          <p>
            Certain items cannot be returned due to health, safety, or hygiene reasons:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Personal care products that have been opened or used</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Aromatherapy items with broken seals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Gift cards and digital products</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Items marked as final sale or clearance</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-semibold">Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, please contact our customer service team within 48 hours of delivery.
            We'll provide a prepaid return label and arrange for a replacement or refund. Please include photos of the damaged
            item when contacting us to expedite the process.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="faq-1">
            <AccordionTrigger>Do I have to pay for return shipping?</AccordionTrigger>
            <AccordionContent>
              Yes, customers are responsible for return shipping costs, unless the item is defective or we made an error in your order. 
              We recommend using a trackable shipping method in case there are any issues with the return.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2">
            <AccordionTrigger>Can I return an item I received as a gift?</AccordionTrigger>
            <AccordionContent>
              Yes, gift returns are accepted. If you received a gift from our store, you can return it for store credit. 
              You'll need the order number, which the gift giver can provide, or you can contact our customer service team for assistance.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3">
            <AccordionTrigger>What if my return window has expired?</AccordionTrigger>
            <AccordionContent>
              We may still accept returns after the 30-day window on a case-by-case basis, but they will typically be eligible for 
              store credit or exchange only, not a full refund. Please contact our customer service team to discuss your specific situation.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-4">
            <AccordionTrigger>How long will it take to process my return?</AccordionTrigger>
            <AccordionContent>
              Once we receive your return, it generally takes 3-5 business days to inspect and process it. 
              You'll receive an email notification when your return is processed, and refunds may take an additional 
              5-10 business days to appear in your account, depending on your payment method.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="bg-muted p-6 rounded-lg text-center mb-8">
          <CircleHelp className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Need Further Assistance?</h3>
          <p className="mb-4">
            Our customer service team is here to help with any questions about returns, refunds, or exchanges.
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
        
        <div className="flex items-center justify-center">
          <Button variant="ghost" asChild>
            <Link href="/shipping" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shipping Information
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
