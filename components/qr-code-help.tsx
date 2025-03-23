import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Smartphone, QrCode, CreditCard } from "lucide-react"

export function QrCodeHelp() {
  return (
    <div className="mt-4 border rounded-md p-4 bg-muted/30">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-medium">Need help with QR code payment?</h3>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-qr">
          <AccordionTrigger className="text-sm">What is QR code payment?</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              QR code payment allows you to complete your purchase using your mobile device. It's a convenient way to
              pay without entering card details on this device.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="how-to-scan">
          <AccordionTrigger className="text-sm">How do I scan the QR code?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Smartphone size={16} />
                Open your phone's camera app and point it at the QR code
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <QrCode size={16} />
                Your phone should recognize the QR code and show a notification
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CreditCard size={16} />
                Tap the notification and complete the payment on your phone
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="not-working">
          <AccordionTrigger className="text-sm">QR code not working?</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">If you're having trouble with the QR code, you can:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Make sure your camera app can scan QR codes</li>
              <li>Try using a QR code scanner app</li>
              <li>Use the direct payment button instead</li>
              <li>Try refreshing the page and generating a new QR code</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

