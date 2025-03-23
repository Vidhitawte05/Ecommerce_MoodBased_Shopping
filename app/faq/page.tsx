"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Search } from 'lucide-react'

// FAQ questions and answers
const faqItems = [
  {
    category: "Orders & Shipping",
    items: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available at checkout for 1-2 business day delivery."
      },
      {
        question: "Do you offer international shipping?",
        answer: "Yes, we ship to most countries worldwide. International shipping times vary based on location, typically taking 7-14 business days. Additional customs fees may apply depending on your country's import regulations."
      },
      {
        question: "How can I track my order?",
        answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by logging into your account and viewing your order history or using the 'Track Your Order' link in our footer."
      },
      {
        question: "What if my order hasn't arrived within the estimated timeframe?",
        answer: "If your order hasn't arrived within the expected timeframe, please contact our customer service team. We'll check your order status and shipping information and resolve any issues promptly."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        question: "What is your return policy?",
        answer: "We accept returns within 30 days of delivery. Items must be unused, in their original packaging, and in the same condition you received them. Please see our Returns & Refunds Policy page for full details."
      },
      {
        question: "How do I initiate a return?",
        answer: "To start a return, log into your account, find the order, and select 'Return Items.' Alternatively, contact our customer service team. Once your return is approved, you'll receive a return shipping label and instructions."
      },
      {
        question: "How long do refunds take to process?",
        answer: "Once we receive your returned items, we'll inspect them and process your refund within 3-5 business days. The funds may take an additional 5-10 business days to appear in your account, depending on your payment method and financial institution."
      },
      {
        question: "Do you offer exchanges?",
        answer: "Yes, we offer exchanges for items of equal value. To request an exchange, follow the same process as a return but select 'Exchange' instead. If the replacement item costs more, you'll need to pay the difference."
      }
    ]
  },
  {
    category: "Products & Usage",
    items: [
      {
        question: "How does the mood quiz work?",
        answer: "Our mood quiz uses a scientifically-backed algorithm to determine your current emotional state based on your responses to a series of questions. It then recommends products specifically tailored to complement or enhance your mood."
      },
      {
        question: "Are your products sustainably sourced?",
        answer: "Yes, we prioritize sustainability across our product line. We work with ethical suppliers, use eco-friendly materials whenever possible, and continually strive to reduce our environmental footprint. Each product page includes specific information about sustainability."
      },
      {
        question: "Do you test on animals?",
        answer: "No, Moody does not test on animals, nor do we work with suppliers who conduct animal testing. We are committed to cruelty-free practices across our entire product range."
      },
      {
        question: "How do I know which mood-based products are right for me?",
        answer: "We recommend taking our mood quiz for personalized recommendations. Each product also includes detailed information about which moods it best complements. If you're still unsure, our customer service team can provide guidance based on your specific needs."
      }
    ]
  },
  {
    category: "Account & Payments",
    items: [
      {
        question: "How do I create an account?",
        answer: "You can create an account by clicking the 'Sign Up' link in the top navigation bar or during the checkout process. You'll need to provide your name, email address, and create a password."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Razorpay, and Apple Pay. All payment information is securely processed and encrypted."
      },
      {
        question: "Is my personal information secure?",
        answer: "Yes, we take data security seriously. We use industry-standard encryption and security measures to protect your personal and payment information. Please see our Privacy Policy for detailed information about how we handle your data."
      },
      {
        question: "Can I place an order without creating an account?",
        answer: "Yes, we offer a guest checkout option. However, creating an account allows you to track orders, save your shipping information, and access your purchase history."
      }
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  
  // Filter FAQ items based on search query
  const filteredFAQs = searchQuery
    ? faqItems.map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(category => category.items.length > 0)
    : faqItems
  
  // Toggle expanded category
  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(c => c !== category))
    } else {
      setExpandedCategories([...expandedCategories, category])
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our products, shipping, returns, and more.
          If you can't find what you're looking for, please contact our customer support team.
        </p>
      </div>
      
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search FAQ..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              className="absolute right-0 top-0 h-full px-3" 
              onClick={() => setSearchQuery("")}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {filteredFAQs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">No results found for "{searchQuery}"</p>
          <p className="text-muted-foreground mb-6">
            Try searching with different keywords or browse our FAQ categories below.
          </p>
          <Button onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {filteredFAQs.map((category, index) => (
            <div key={index} className="mb-8">
              <h2 
                className="text-xl font-semibold mb-4 cursor-pointer flex items-center"
                onClick={() => toggleCategory(category.category)}
              >
                {category.category}
                <span className="ml-2 text-muted-foreground">
                  ({category.items.length})
                </span>
              </h2>
              <Accordion type="single" collapsible className="border rounded-lg">
                {category.items.map((item, itemIndex) => (
                  <AccordionItem key={itemIndex} value={`${category.category}-${itemIndex}`}>
                    <AccordionTrigger className="px-4 hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center mt-12 p-6 bg-muted rounded-lg max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
        <p className="mb-4">
          Our customer support team is here to help with any questions you might have.
        </p>
        <Button asChild>
          <a href="/contact">Contact Us</a>
        </Button>
      </div>
    </div>
  )
}
