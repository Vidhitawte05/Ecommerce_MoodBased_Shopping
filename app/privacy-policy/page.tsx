import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last Updated: October 1, 2023
          </p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p>
            At Moody, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you visit our website and use our services.
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
            please do not access the site.
          </p>
          
          <h2>Information We Collect</h2>
          <p>
            We collect information about you in various ways when you use our website and services.
          </p>
          
          <h3>Personal Data</h3>
          <p>
            Personally identifiable information may include, but is not limited to:
          </p>
          <ul>
            <li>Your name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Billing and shipping address</li>
            <li>Payment information (we do not store complete credit card information)</li>
            <li>Demographic information</li>
          </ul>
          
          <h3>Usage Data</h3>
          <p>
            We may also collect information on how you access and use our website, including:
          </p>
          <ul>
            <li>Your computer's IP address</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on those pages</li>
            <li>Time and date of your visit</li>
            <li>Other diagnostic data</li>
          </ul>
          
          <h3>Mood Quiz Data</h3>
          <p>
            When you take our mood quiz, we collect your responses to better understand your preferences 
            and provide personalized product recommendations. This information helps us analyze patterns 
            in emotional shopping behaviors and improve our services.
          </p>
          
          <h2>How We Use Your Information</h2>
          <p>
            We may use the information we collect from you in the following ways:
          </p>
          <ul>
            <li>To personalize your experience and deliver content and product offerings relevant to your moods and interests</li>
            <li>To improve our website and services</li>
            <li>To process transactions and send order confirmations</li>
            <li>To administer promotions, surveys, or other site features</li>
            <li>To send periodic emails regarding orders, products, or other information</li>
            <li>To follow up after correspondence (email or phone inquiries)</li>
            <li>To analyze trends and better understand our audience</li>
          </ul>
          
          <h2>Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. 
            Your personal information is contained behind secured networks and is only accessible by a limited 
            number of persons who have special access rights to such systems, and are required to keep the 
            information confidential. When you place orders or access your personal information, we offer the 
            use of a secure server. All sensitive information you supply is encrypted via Secure Socket Layer 
            (SSL) technology.
          </p>
          
          <h2>Cookies</h2>
          <p>
            We use cookies to help us remember and process the items in your shopping cart, understand and save 
            your preferences for future visits, keep track of advertisements, and compile aggregate data about 
            site traffic and site interaction.
          </p>
          <p>
            You can choose to have your computer warn you each time a cookie is being sent, or you can choose 
            to turn off all cookies. You do this through your browser settings. Since each browser is different, 
            look at your browser's Help Menu to learn the correct way to modify your cookies.
          </p>
          
          <h2>Third-Party Disclosure</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside 
            parties without your consent, except as described below:
          </p>
          <ul>
            <li>Trusted third parties who assist us in operating our website, conducting our business, or servicing you</li>
            <li>Legal requirements when we believe disclosure is appropriate to comply with the law or protect our rights</li>
            <li>In the event of a merger, acquisition, or sale of all or a portion of our assets</li>
          </ul>
          
          <h2>Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We have no control over the content, privacy 
            policies, or practices of any third-party sites or services. We encourage you to review the privacy 
            policy of any site you visit.
          </p>
          
          <h2>Children's Privacy</h2>
          <p>
            Our website is not intended for children under 13 years of age. We do not knowingly collect personal 
            information from children under 13. If you are a parent or guardian and believe your child has 
            provided us with personal information, please contact us so we can take necessary actions.
          </p>
          
          <h2>Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul>
            <li>The right to access personal information we hold about you</li>
            <li>The right to request correction of inaccurate information</li>
            <li>The right to request deletion of your information</li>
            <li>The right to restrict or object to processing</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided below.
          </p>
          
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review 
            this Privacy Policy periodically for any changes.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <address className="not-italic">
            Moody Customer Service<br />
            Email: privacy@moody.com<br />
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
              <Link href="/terms">Terms of Service</Link>
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
