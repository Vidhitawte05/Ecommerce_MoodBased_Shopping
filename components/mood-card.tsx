import Link from "next/link"
import { Lightbulb, Wind, Feather, Gamepad2, CloudFog, Zap, Heart, DoorOpen, type LucideIcon } from "lucide-react"

type MoodType = {
  name: string
  color: string
  icon: string
}

const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  Wind,
  Feather,
  Gamepad2,
  CloudFog,
  Zap,
  Heart,
  DoorOpen,
}

export function MoodCard({ mood }: { mood: MoodType }) {
  const Icon = iconMap[mood.icon]

  return (
    <Link href={`/mood/${mood.name.toLowerCase()}`}>
      <div className={`mood-card ${mood.color} p-6 rounded-lg text-center cursor-pointer`}>
        <div className="mb-3 flex justify-center">{Icon && <Icon size={32} className="text-primary" />}</div>
        <h3 className="font-medium">{mood.name}</h3>
      </div>
    </Link>
  )
}

