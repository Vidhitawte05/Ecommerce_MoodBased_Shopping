"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft, Mail, Check } from "lucide-react"

type ContactSubmission = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
  isRead: boolean
}

export default function AdminContactPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(true)

  // Admin check - in a real app, you'd check for admin role
  const isAdmin = isAuthenticated && user?.email === "admin@example.com"

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/admin/contact")
    } else if (!isLoading && !isAdmin) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!isAdmin) return

      try {
        setIsSubmissionsLoading(true)

        // In a real app, you would fetch from your API
        // For now, we'll simulate with localStorage
        const contactData = localStorage.getItem("db_contact_submissions")
        let contactSubmissions: ContactSubmission[] = []

        if (contactData) {
          contactSubmissions = JSON.parse(contactData)
        }

        setSubmissions(contactSubmissions)
      } catch (error) {
        console.error("Error fetching contact submissions:", error)
        toast({
          title: "Error",
          description: "Failed to load contact submissions",
          variant: "destructive",
        })
      } finally {
        setIsSubmissionsLoading(false)
      }
    }

    if (isAdmin) {
      fetchSubmissions()
    }
  }, [isAdmin, toast])

  const handleMarkAsRead = async (id: string) => {
    try {
      // In a real app, you would call your API
      // For now, we'll update localStorage directly
      const contactData = localStorage.getItem("db_contact_submissions")
      if (contactData) {
        const contactSubmissions: ContactSubmission[] = JSON.parse(contactData)
        const updatedSubmissions = contactSubmissions.map((submission) =>
          submission.id === id ? { ...submission, isRead: true } : submission,
        )

        localStorage.setItem("db_contact_submissions", JSON.stringify(updatedSubmissions))
        setSubmissions(updatedSubmissions)

        toast({
          title: "Success",
          description: "Marked as read",
        })
      }
    } catch (error) {
      console.error("Error marking as read:", error)
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  if (!isAuthenticated || !isAdmin) {
    return <div className="container mx-auto px-4 py-12 text-center">Access denied. Admin privileges required.</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
      </div>

      {isSubmissionsLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Submissions</CardTitle>
            <CardDescription>There are no contact form submissions yet.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <Card key={submission.id} className={submission.isRead ? "opacity-75" : ""}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center">
                    {!submission.isRead && <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>}
                    {submission.subject}
                  </CardTitle>
                  <CardDescription>
                    From: {submission.name} ({submission.email})
                  </CardDescription>
                </div>
                <CardDescription>{new Date(submission.createdAt).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="whitespace-pre-wrap">{submission.message}</p>

                <div className="flex justify-end">
                  {!submission.isRead && (
                    <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(submission.id)}>
                      <Check size={16} className="mr-2" />
                      Mark as Read
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="ml-2" asChild>
                    <a href={`mailto:${submission.email}`}>
                      <Mail size={16} className="mr-2" />
                      Reply via Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

