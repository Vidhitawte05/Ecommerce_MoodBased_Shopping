import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock blog post data
const blogPosts = [
  {
    id: 1,
    title: "How Your Mood Affects Your Shopping Habits",
    excerpt: "Discover the science behind emotional shopping and how to make more mindful purchases based on your mood.",
    image: "/blog1.jpg?height=400&width=600",
    date: "May 15, 2023",
    author: "Dr. Emily Chen",
    category: "Psychology",
    tags: ["Mood", "Shopping", "Mindfulness"]
  },
  {
    id: 2,
    title: "5 Products to Boost Creativity When You're Feeling Stuck",
    excerpt: "Feeling creatively blocked? These five products can help stimulate your imagination and get those ideas flowing again.",
    image: "/blog2.jpg?height=400&width=600",
    date: "June 3, 2023",
    author: "Marcus Johnson",
    category: "Products",
    tags: ["Creativity", "Productivity", "Self-care"]
  },
  {
    id: 3,
    title: "Understanding the Connection Between Home Decor and Mood",
    excerpt: "Your living environment has a profound impact on your emotional wellbeing. Learn how to design spaces that support your desired mood.",
    image: "/blog3.jpg?height=400&width=600",
    date: "June 28, 2023",
    author: "Sofia Patel",
    category: "Lifestyle",
    tags: ["Home", "Design", "Wellbeing"]
  },
  {
    id: 4,
    title: "The Science of Color Psychology in Product Design",
    excerpt: "How different colors in products can affect your mood and emotions, and how to use this knowledge to your advantage.",
    image: "/blog4.jpg?height=400&width=600",
    date: "July 10, 2023",
    author: "Dr. James Wilson",
    category: "Psychology",
    tags: ["Color", "Design", "Psychology"]
  },
  {
    id: 5,
    title: "Anxiety-Reducing Products That Actually Work",
    excerpt: "Our team tested dozens of products marketed for anxiety relief. Here are the ones with scientific backing that made a real difference.",
    image: "/blog5.png?height=400&width=600",
    date: "August 5, 2023",
    author: "Dr. Emily Chen",
    category: "Products",
    tags: ["Anxiety", "Wellness", "Research"]
  },
  {
    id: 6,
    title: "How to Create a Mood-Boosting Morning Routine",
    excerpt: "Start your day on the right note with these mood-enhancing practices and products that can transform your morning routine.",
    image: "/blog6.jpg?height=400&width=600",
    date: "August 23, 2023",
    author: "Marcus Johnson",
    category: "Lifestyle",
    tags: ["Routine", "Morning", "Happiness"]
  }
]

// Featured post
const featuredPost = {
  id: 7,
  title: "The Ultimate Guide to Understanding Your Emotional Needs While Shopping",
  excerpt: "Shopping isn't just about acquiring things—it's often about fulfilling emotional needs. This comprehensive guide helps you understand your emotional motivations and make more satisfying purchases.",
  image: "/blog7.webp?height=600&width=1200",
  date: "September 1, 2023",
  author: "Dr. Emily Chen",
  category: "Psychology",
  tags: ["Shopping", "Emotions", "Self-awareness", "Guide"]
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Moody Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore articles about the intersection of emotions, shopping, and wellbeing.
          Discover insights that help you live more intentionally.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="psychology">Psychology</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-64">
          <Input placeholder="Search articles..." />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-0 top-0 h-full"
          >
            Search
          </Button>
        </div>
      </div>
      
      {/* Featured Post */}
      <div className="mb-12">
        <Card className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <Image 
                src={featuredPost.image || "/placeholder.svg"}
                alt={featuredPost.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-4 left-4">Featured</Badge>
            </div>
            <div className="md:w-1/2 p-6 md:p-8">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{featuredPost.category}</Badge>
                  <span className="text-sm text-muted-foreground">{featuredPost.date}</span>
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-2">
                  <Link href={`/blog/${featuredPost.id}`} className="hover:text-primary transition-colors">
                    {featuredPost.title}
                  </Link>
                </CardTitle>
                <CardDescription>By {featuredPost.author}</CardDescription>
              </CardHeader>
              <CardContent className="p-0 mb-6">
                <p>{featuredPost.excerpt}</p>
              </CardContent>
              <CardFooter className="p-0">
                <Button asChild>
                  <Link href={`/blog/${featuredPost.id}`}>Read Article</Link>
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Blog Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {blogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden flex flex-col">
            <div className="relative h-48">
              <Image 
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{post.category}</Badge>
                <span className="text-sm text-muted-foreground">{post.date}</span>
              </div>
              <CardTitle className="line-clamp-2">
                <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>By {post.author}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href={`/blog/${post.id}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Newsletter Signup */}
      <div className="bg-muted p-8 rounded-lg text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Get weekly articles on mood science, product recommendations, and exclusive offers directly to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input placeholder="Your email address" type="email" />
          <Button>Subscribe</Button>
        </div>
      </div>
      
      {/* Popular Tags */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Popular Topics</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {["Mood", "Psychology", "Wellness", "Self-care", "Productivity", "Shopping", "Home", "Anxiety", "Creativity", "Relationships"].map((tag) => (
            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-muted">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
