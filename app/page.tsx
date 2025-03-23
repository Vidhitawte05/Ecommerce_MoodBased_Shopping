import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { MoodCard } from "@/components/mood-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Home() {
  const moods = [
    { name: "Creative", color: "bg-amber-100", icon: "Lightbulb" },
    { name: "Anxious", color: "bg-blue-100", icon: "Wind" },
    { name: "Fragile", color: "bg-pink-100", icon: "Feather" },
    { name: "Playful", color: "bg-green-100", icon: "Gamepad2" },
    { name: "Muddled", color: "bg-gray-100", icon: "CloudFog" },
    { name: "Wired", color: "bg-yellow-100", icon: "Zap" },
    { name: "Caring", color: "bg-red-100", icon: "Heart" },
    { name: "Open", color: "bg-indigo-100", icon: "DoorOpen" },
  ]

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "The mood quiz was spot on! I found exactly what I needed to lift my spirits.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "I was skeptical at first, but the products recommended for my 'Anxious' mood really helped me relax.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      text: "Love how the site understands that different moods need different products. The weighted blanket was perfect!",
      rating: 5,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Shop Based on Your <span className="text-primary">Mood</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover products that resonate with how you feel. Take our quick mood quiz and let us curate the perfect
            shopping experience for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/quiz">Take the Mood Quiz</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/shopping.jpg"
            alt="Mood shopping experience"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Explore by Mood</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((mood) => (
            <MoodCard key={mood.name} mood={mood} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/moods">View All Moods</Link>
          </Button>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 border rounded-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Take the Mood Quiz</h3>
            <p className="text-muted-foreground">
              Answer a few simple questions to help us understand your current mood.
            </p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Personalized Recommendations</h3>
            <p className="text-muted-foreground">We'll suggest products that match your mood and preferences.</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Shop & Feel Better</h3>
            <p className="text-muted-foreground">
              Enjoy a shopping experience tailored to enhance your emotional wellbeing.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 1, name: "Idea Journal", price: 19.99, image: "/idea_journal.webp?height=300&width=300", rating: 4.5 },
            {
              id: 2,
              name: "Weighted Blanket",
              price: 79.99,
              image: "/weighted_blankets.webp?height=300&width=300",
              rating: 4.8,
            },
            {
              id: 3,
              name: "Aromatherapy Diffuser",
              price: 39.99,
              image: "/diffusers.jpg?height=300&width=300",
              rating: 4.6,
            },
            {
              id: 4,
              name: "Stress Relief Tea",
              price: 14.99,
              image: "/stress_relief.webp?height=300&width=300",
              rating: 4.4,
            },
          ].map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group">
              <div className="border rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-md">
                <div className="aspect-square relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium group-hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={`star-${product.id}-${i}`}
                        className={i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm ml-1 text-muted-foreground">{product.rating}</span>
                  </div>
                  <p className="font-semibold mt-2">${product.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-6 border rounded-lg">
              <div className="flex items-center gap-2 text-yellow-500 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>★</span>
                ))}
              </div>
              <p className="mb-4 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

