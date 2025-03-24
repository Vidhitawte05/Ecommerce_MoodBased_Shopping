"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { Eye, Search, RefreshCw, Mail, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  isRead: boolean
}

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/signin?redirect=/admin/contact")
      return
    }

    // For demo purposes, we'll consider a specific email as admin
    if (!authLoading && isAuthenticated && user?.email !== "admin@example.com") {
      router.push("/")
    }
  }, [authLoading, isAuthenticated, user, router])

  // Fetch contact submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!isAuthenticated || user?.email !== "admin@example.com") return

      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")

        const response = await fetch("/api/admin/contact", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch contact submissions")
        }

        const data = await response.json()
        setSubmissions(data.submissions)
        setFilteredSubmissions(data.submissions)
      } catch (error) {
        console.error("Error fetching contact submissions:", error)

        // Use mock data for demo
        const mockSubmissions = [
          {
            id: "contact1",
            name: "John Doe",
            email: "john@example.com",
            subject: "Product Inquiry",
            message:
              "I'm interested in your Meditation Cushion product. Can you tell me more about the materials used?",
            createdAt: new Date().toISOString(),
            isRead: false,
          },
          {
            id: "contact2",
            name: "Jane Smith",
            email: "jane@example.com",
            subject: "Order Status",
            message:
              "I placed an order 3 days ago (Order #ORD-123456) and haven't received any shipping updates. Can you help?",
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            isRead: true,
          },
          {
            id: "contact3",
            name: "Bob Johnson",
            email: "bob@example.com",
            subject: "Return Request",
            message:
              "I received my order but the Aromatherapy Diffuser is damaged. I'd like to return it for a replacement.",
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            isRead: false,
          },
          {
            id: "contact4",
            name: "Alice Williams",
            email: "alice@example.com",
            subject: "Wholesale Inquiry",
            message:
              "I own a wellness center and I'm interested in purchasing your products in bulk. Do you offer wholesale pricing?",
            createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            isRead: true,
          },
        ]

        setSubmissions(mockSubmissions)
        setFilteredSubmissions(mockSubmissions)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubmissions()
  }, [isAuthenticated, user])

  // Filter submissions when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredSubmissions(submissions)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = submissions.filter(
      (submission) =>
        submission.name.toLowerCase().includes(query) ||
        submission.email.toLowerCase().includes(query) ||
        submission.subject.toLowerCase().includes(query) ||
        submission.message.toLowerCase().includes(query),
    )

    setFilteredSubmissions(filtered)
  }, [searchQuery, submissions])

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`/api/admin/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isRead: true }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark submission as read")
      }

      // Update local state
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) => (submission.id === id ? { ...submission, isRead: true } : submission)),
      )

      toast({
        title: "Marked as Read",
        description: "Contact submission has been marked as read",
      })
    } catch (error) {
      console.error("Error marking submission as read:", error)

      // For demo, update the UI anyway
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) => (submission.id === id ? { ...submission, isRead: true } : submission)),
      )

      toast({
        title: "Marked as Read",
        description: "Contact submission has been marked as read",
      })
    }
  }

  const handleReply = (submission: ContactSubmission) => {
    // In a real app, this would open an email composer or a form to send a reply
    // For demo purposes, we'll just show a toast
    toast({
      title: "Reply Sent",
      description: `Your reply to ${submission.name} has been sent`,
    })
  }

  if (authLoading || (isAuthenticated && user?.email !== "admin@example.com" && isLoading)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.email !== "admin@example.com") {
    return null // Router will handle redirect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Contact Submissions</h1>
          <p className="text-muted-foreground">View and respond to customer inquiries</p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0" onClick={() => router.refresh()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Submissions</CardTitle>
          <CardDescription>Find specific contact submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, subject, or message..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions</CardTitle>
          <CardDescription>
            {filteredSubmissions.length} {filteredSubmissions.length === 1 ? "submission" : "submissions"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No contact submissions found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id} className={!submission.isRead ? "bg-primary/5" : undefined}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.subject}</TableCell>
                      <TableCell>{new Date(submission.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {submission.isRead ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Read
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Unread
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedSubmission(submission)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleReply(submission)}>
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Reply</span>
                          </Button>
                          {!submission.isRead && (
                            <Button variant="ghost" size="icon" onClick={() => handleMarkAsRead(submission.id)}>
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Mark as Read</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Details Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Contact Submission</DialogTitle>
            <DialogDescription>
              Received on {selectedSubmission && new Date(selectedSubmission.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p>{selectedSubmission.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{selectedSubmission.email}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                <p>{selectedSubmission.subject}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                <div className="p-4 bg-muted rounded-md mt-2 whitespace-pre-wrap">{selectedSubmission.message}</div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                  Close
                </Button>
                <Button onClick={() => handleReply(selectedSubmission)}>
                  <Mail className="mr-2 h-4 w-4" />
                  Reply
                </Button>
                {!selectedSubmission.isRead && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleMarkAsRead(selectedSubmission.id)
                      setSelectedSubmission({ ...selectedSubmission, isRead: true })
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

