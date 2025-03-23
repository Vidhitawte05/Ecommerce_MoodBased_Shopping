import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Wind, Feather, Gamepad2, CloudFog, Zap, Heart, DoorOpen } from 'lucide-react'

// Complete list of moods
const moods = [
  { 
    name: "Creative", 
    description: "Enhance your creative energy with products designed to inspire and spark new ideas.", 
    color: "bg-amber-100",
    icon: Lightbulb
  },
  { 
    name: "Anxious", 
    description: "Find comfort and calm with products that help reduce anxiety and promote relaxation.", 
    color: "bg-blue-100",
    icon: Wind
  },
  { 
    name: "Fragile", 
    description: "Nurture yourself with gentle, comforting products that provide support during sensitive times.", 
    color: "bg-pink-100",
    icon: Feather
  },
  { 
    name: "Playful", 
    description: "Embrace your playful side with fun products that bring joy and lightheartedness.", 
    color: "bg-green-100",
    icon: Gamepad2
  },
  { 
    name: "Muddled", 
    description: "Clear your mind with products that help organize thoughts and reduce mental clutter.", 
    color: "bg-gray-100",
    icon: CloudFog
  },
  { 
    name: "Wired", 
    description: "Channel your high energy into productive outlets with these energizing products.", 
    color: "bg-yellow-100",
    icon: Zap
  },
  { 
    name: "Caring", 
    description: "Express your nurturing nature with products that help you care for yourself and others.", 
    color: "bg-red-100",
    icon: Heart
  },
  { 
    name: "Open", 
    description: "Explore new possibilities with products that encourage openness and new experiences.", 
    color: "bg-indigo-100",
    icon: DoorOpen
  },
  { 
    name: "Serene", 
    description: "Maintain your peaceful state with products that promote tranquility and balance.", 
    color: "bg-cyan-100",
    icon: Wind
  },
  { 
    name: "Mellow", 
    description: "Complement your relaxed mood with soothing products that enhance your calm state.", 
    color: "bg-purple-100",
    icon: CloudFog
  },
  { 
    name: "Eccentric", 
    description: "Celebrate your unique perspective with unconventional products that match your distinctive style.", 
    color: "bg-orange-100",
    icon: Lightbulb
  },
  { 
    name: "Vulnerable", 
    description: "Support yourself during vulnerable moments with products that offer comfort and reassurance.", 
    color: "bg-rose-100",
    icon: Feather
  },
  { 
    name: "Curious", 
    description: "Feed your inquisitive mind with products that satisfy your thirst for knowledge and discovery.", 
    color: "bg-emerald-100",
    icon: Lightbulb
  },
  { 
    name: "Unhinged", 
    description: "Find balance and grounding with products that help stabilize fluctuating emotions.", 
    color: "bg-violet-100",
    icon: CloudFog
  },
  { 
    name: "Freespirited", 
    description: "Embrace your independent nature with products that celebrate freedom and spontaneity.", 
    color: "bg-lime-100",
    icon: Wind
  }
]

export default function MoodsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Shop by Mood</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover products that match your current emotional state. From creative to serene, 
          we have products tailored to enhance and complement how you feel.
        </p>
      </div>
      
      <div className="mb-8 text-center">
        <Button className="mx-auto" asChild>
          <Link href="/quiz">
            Not sure what mood you're in? Take our quiz!
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moods.map((mood) => (
          <Card key={mood.name} className={`overflow-hidden ${mood.color} border-none`}>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <mood.icon size={36} className="text-primary" />
              </div>
              <CardTitle>{mood.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-800">
                {mood.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="secondary" asChild>
                <Link href={`/mood/${mood.name.toLowerCase()}`}>
                  Shop {mood.name} Products
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
