"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

// Define the quiz questions
const questions = [
  {
    id: 1,
    question: "How would you describe your energy level right now?",
    options: [
      { id: "a", text: "High energy, feeling wired" },
      { id: "b", text: "Balanced and steady" },
      { id: "c", text: "Low energy, feeling drained" },
      { id: "d", text: "Fluctuating between highs and lows" },
    ],
  },
  {
    id: 2,
    question: "What best describes your current thought patterns?",
    options: [
      { id: "a", text: "Creative and flowing with ideas" },
      { id: "b", text: "Focused and clear" },
      { id: "c", text: "Scattered or muddled" },
      { id: "d", text: "Overthinking or anxious" },
    ],
  },
  {
    id: 3,
    question: "How would you describe your emotional state?",
    options: [
      { id: "a", text: "Joyful and playful" },
      { id: "b", text: "Calm and serene" },
      { id: "c", text: "Sensitive or vulnerable" },
      { id: "d", text: "Curious and open" },
    ],
  },
  {
    id: 4,
    question: "What kind of environment are you drawn to right now?",
    options: [
      { id: "a", text: "Vibrant and stimulating" },
      { id: "b", text: "Peaceful and soothing" },
      { id: "c", text: "Cozy and secure" },
      { id: "d", text: "Novel and interesting" },
    ],
  },
  {
    id: 5,
    question: "How do you feel about social interactions at the moment?",
    options: [
      { id: "a", text: "Seeking connection and engagement" },
      { id: "b", text: "Preferring solitude and reflection" },
      { id: "c", text: "Wanting supportive and caring interactions" },
      { id: "d", text: "Feeling unpredictable about social needs" },
    ],
  },
]

// Map answers to moods
const moodMapping: Record<string, Record<string, number>> = {
  Creative: { "2a": 3, "1a": 2, "4a": 1 },
  Anxious: { "2d": 3, "1d": 2, "5b": 1 },
  Fragile: { "3c": 3, "1c": 2, "4c": 1 },
  Playful: { "3a": 3, "1a": 2, "4a": 1 },
  Muddled: { "2c": 3, "1d": 2, "5d": 1 },
  Wired: { "1a": 3, "2d": 2, "4a": 1 },
  Caring: { "5c": 3, "3c": 2, "2b": 1 },
  Open: { "5a": 3, "3d": 2, "4d": 1 },
  Serene: { "3b": 3, "1b": 2, "4b": 1 },
  Mellow: { "1c": 3, "3b": 2, "5b": 1 },
  Eccentric: { "2a": 3, "3d": 2, "5d": 1 },
  Vulnerable: { "3c": 3, "5b": 2, "1c": 1 },
  Curious: { "3d": 3, "4d": 2, "2a": 1 },
  Unhinged: { "1d": 3, "2c": 2, "5d": 1 },
  Freespirited: { "4d": 3, "1a": 2, "3a": 1 },
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [quizComplete, setQuizComplete] = useState(false)
  const [determinedMood, setDeterminedMood] = useState<string | null>(null)
  const router = useRouter()

  const handleNext = () => {
    if (selectedOption) {
      // Save the answer
      setAnswers({ ...answers, [questions[currentQuestion].id]: selectedOption })

      // Move to next question or finish quiz
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
      } else {
        // Calculate mood
        const mood = calculateMood({ ...answers, [questions[currentQuestion].id]: selectedOption })
        setDeterminedMood(mood)
        setQuizComplete(true)
      }
    }
  }

  const calculateMood = (userAnswers: Record<number, string>) => {
    const moodScores: Record<string, number> = {}

    // Initialize all moods with 0 score
    Object.keys(moodMapping).forEach((mood) => {
      moodScores[mood] = 0
    })

    // Calculate scores for each mood based on answers
    Object.entries(userAnswers).forEach(([questionId, answerId]) => {
      const answerKey = `${questionId}${answerId}`

      Object.entries(moodMapping).forEach(([mood, answerWeights]) => {
        if (answerWeights[answerKey]) {
          moodScores[mood] += answerWeights[answerKey]
        }
      })
    })

    // Find the mood with the highest score
    let highestScore = 0
    let determinedMood = "Creative" // Default mood

    Object.entries(moodScores).forEach(([mood, score]) => {
      if (score > highestScore) {
        highestScore = score
        determinedMood = mood
      }
    })

    return determinedMood
  }

  const handleViewProducts = () => {
    if (determinedMood) {
      router.push(`/mood/${determinedMood.toLowerCase()}`)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="container mx-auto px-4 py-12 quiz-container">
      <h1 className="text-3xl font-bold text-center mb-8">Mood Discovery Quiz</h1>

      {!quizComplete ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
            <CardDescription>{questions[currentQuestion].question}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-6" />

            <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="space-y-4">
              {questions[currentQuestion].options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={handleNext} disabled={!selectedOption} className="w-full">
              {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Quiz"}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Your Mood: {determinedMood}</CardTitle>
            <CardDescription>Based on your answers, we've determined your current mood.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-8 rounded-full bg-primary/10 inline-flex">
              <div className="text-5xl text-primary">✨</div>
            </div>
            <p className="mb-6">
              We've curated a selection of products that will complement and enhance your{" "}
              {determinedMood?.toLowerCase()} mood.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleViewProducts} size="lg">
              View Recommended Products
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setQuizComplete(false)
                setCurrentQuestion(0)
                setAnswers({})
                setSelectedOption(null)
              }}
              size="lg"
            >
              Retake Quiz
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

