import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last Updated: October 1, 2023
          </p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p>
            Welcome to Moody. These Terms of Service ("Terms") govern your use of our website,
            products, and services. By accessing or using our services, you agree to be bound
            by these Terms. Please read them carefully.
          </p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using our services, you agree to be bound by these Terms and our Privacy Policy.
            If you do not agree to these Terms, please do not use our services.
          </p>
          
          <h2>2. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes
            by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of
            our services after such changes constitutes your acceptance of the new Terms.
          </p>
          
          <h2>3. Account Registration</h2>
          <p>
            To access certain features of our services, you may need to create an account. You agree to provide
            accurate, current, and complete information during the registration process and to update such information
            to keep it accurate, current, and complete.
          </p>
          <p>
            You are responsible for safeguarding your password and for all activities that occur under your account.
            You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
          </p>
          
          <h2>4. User Conduct</h2>
          <p>
            You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
          </p>
          <ul>
            <li>Use our services in any way that violates any applicable law or regulation</li>
            <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of our services</li>
            <li>Attempt to gain unauthorized access to our systems or user accounts</li>
            <li>Use our services for any harmful, fraudulent, or deceptive purpose</li>
            <li>Engage in any activity that could damage, disable, or impair the functioning of our services</li>
          </ul>
          
          <h2>5. Purchases and Payments</h2>
          <p>
            All purchases through our website are subject to our order acceptance. We reserve the right to refuse or
            cancel any order for any reason, including errors in pricing or availability.
          </p>
          <p>
            Payment must be made at the time of purchase using one of our accepted payment methods. All prices are
            in the currency specified and include applicable taxes.
          </p>
          
          <h2>6. Shipping and Delivery</h2>
          <p>
            We will make every effort to deliver products within the estimated timeframes. However, shipping times
            are estimates and not guaranteed. We are not responsible for delays due to customs processing for
            international orders or other circumstances beyond our control.
          </p>
          
          <h2>7. Return and Refund Policy</h2>
          <p>
            Our return and refund policy is outlined in our <Link href="/shipping" className="text-primary hover:underline">Shipping & Returns</Link> page,
            which is incorporated into these Terms by reference.
          </p>
          
          <h2>8. Intellectual Property</h2>
          <p>
            All content on our website, including text, graphics, logos, images, and software, is our property
            or the property of our licensors and is protected by copyright, trademark, and other intellectual
            property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, create derivative works from, publicly display, or
            exploit any content from our website without our express written permission.
          </p>
          
          <h2>9. Disclaimer of Warranties</h2>
          <p>
            OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND,
            EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          
          <h2>10. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL MOODY, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED
            TO YOUR USE OF OUR SERVICES.
          </p>
          <p>
            OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO YOUR USE OF OUR SERVICES
            SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO US IN THE MOST RECENT THREE-MONTH PERIOD.
          </p>
          
          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Moody and its officers, directors, employees,
            and agents from and against any claims, liabilities, damages, losses, and expenses, including
            reasonable attorneys' fees, arising out of or in any way connected with your access to or use
            of our services or your violation of these Terms.
          </p>
          
          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the state of
            [State], without regard to its conflict of law principles.
          </p>
          
          <h2>13. Dispute Resolution</h2>
          <p>
            Any dispute arising from or relating to these Terms or our services shall first be resolved
            through good-faith negotiations. If such negotiations fail, the dispute shall be resolved
            through binding arbitration in accordance with the rules of the American Arbitration Association.
          </p>
          
          <h2>14. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall
            be limited or eliminated to the minimum extent necessary so that the Terms shall otherwise
            remain in full force and effect and enforceable.
          </p>
          
          <h2>15. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <address className="not-italic">
            Moody Customer Service<br />
            Email: terms@moody.com<br />
            Phone: +1 (800) 123-4567<br />
            Address: 123 Mood Street, Wellness City, WC 12345
          </address>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground mb-4 sm:mb-0">
            © {new Date().getFullYear()} Moody. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
