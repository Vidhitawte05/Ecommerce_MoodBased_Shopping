import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Instagram, Linkedin, Twitter } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Joslyn Jose",
      role: "Founder & CEO",
      bio: "Joslyn founded Moody with a vision to create a shopping experience that connects with people on an emotional level.",
      image: "/images/team/jane-smith.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      name: "Vidhi Tawte",
      role: "Chief Product Officer",
      bio: "Vidhi oversees product development and ensures each item in our catalog meets our mood-enhancing standards.",
      image: "/vidhi.jpeg",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      name: "Anisha Gavhankar",
      role: "Head of Customer Experience",
      bio: "Anisha is dedicated to creating a shopping journey that's as emotionally rewarding as the products themselves.",
      image: "anisha.jpeg",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      name: "Sejal Jaiswar",
      role: "Chief Mood Officer",
      bio: "Sejal leads our mood research team, developing the algorithms that power our personalized recommendations.",
      image: "/images/team/david-rodriguez.jpg",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We believe shopping should be more than just a transaction—it should be an experience that resonates with how
          you feel.
        </p>
      </section>

      {/* Mission Section */}
      <section className="mb-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image src="/logo.jpeg?height=800&width=600" alt="Our mission" fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-6">
            At Moody, we're on a mission to transform the way people shop by connecting products to emotions. We
            understand that your mood influences your preferences, and we've built a platform that curates products
            based on how you feel.
          </p>
          <p className="text-lg text-muted-foreground mb-6">
            Whether you're feeling creative, anxious, playful, or any other emotion, we have carefully selected products
            that can enhance or complement your current state of mind.
          </p>
          <Button asChild>
            <Link href="/quiz">Take the Mood Quiz</Link>
          </Button>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Emotional Intelligence</h3>
              <p className="text-muted-foreground">
                We believe in the power of understanding and responding to emotions in ourselves and others.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mindful Consumption</h3>
              <p className="text-muted-foreground">
                We promote thoughtful purchasing decisions that align with your emotional needs and values.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Connection</h3>
              <p className="text-muted-foreground">
                We foster a community where people can share how products impact their emotional wellbeing.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                <div className="flex space-x-2">
                  {member.social.twitter && (
                    <Link href={member.social.twitter} className="text-muted-foreground hover:text-primary">
                      <Twitter size={16} />
                    </Link>
                  )}
                  {member.social.linkedin && (
                    <Link href={member.social.linkedin} className="text-muted-foreground hover:text-primary">
                      <Linkedin size={16} />
                    </Link>
                  )}
                  {member.social.instagram && (
                    <Link href={member.social.instagram} className="text-muted-foreground hover:text-primary">
                      <Instagram size={16} />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Join Us Section */}
      <section className="text-center bg-muted p-12 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          We're always looking for passionate individuals who believe in the connection between emotions and shopping
          experiences.
        </p>
        <Button asChild>
          <Link href="/contact">Get in Touch</Link>
        </Button>
      </section>
    </div>
  )
}

