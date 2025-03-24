import { ArrowLeft, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function ReturnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Return Policy</h1>

        <div className="space-y-4">
          <p>
            We want you to be completely satisfied with your purchase. If you're not entirely happy, we're here to help.
          </p>

          <h2 className="text-xl font-semibold mt-4">Return Guidelines</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You have 30 days to return an item from the date you received it.</li>
            <li>
              To be eligible for a return, your item must be unused and in the same condition that you received it.
            </li>
            <li>The item must be in the original packaging.</li>
            <li>You need the receipt or proof of purchase.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-4">How to Initiate a Return</h2>
          <p>
            To start a return, please email us at returns@moodcommerce.com with your order number and reason for return.
            We will provide you with specific instructions and a return shipping address.
          </p>

          <div className="flex items-start mt-6 p-4 bg-blue-50 rounded-md">
            <HelpCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Need Help?</h3>
              <p className="text-sm text-blue-700">
                If you have any questions about our return policy, please contact our customer service team at
                support@moodcommerce.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

