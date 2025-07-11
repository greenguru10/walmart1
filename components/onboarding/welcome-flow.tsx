"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  Scan,
  Gift,
  Recycle,
  TrendingUp,
  User,
  MapPin,
  Heart,
} from "lucide-react"

interface WelcomeFlowProps {
  onComplete: (userData: any) => void
}

export function WelcomeFlow({ onComplete }: WelcomeFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    location: "",
    interests: [] as string[],
    goals: [] as string[],
  })

  const steps = [
    {
      title: "Welcome to EcoMart! 🌱",
      description: "Your journey to sustainable shopping starts here",
      content: "intro",
    },
    {
      title: "How It Works",
      description: "Watch this quick 2-minute guide",
      content: "video",
    },
    {
      title: "Tell Us About You",
      description: "Personalize your experience",
      content: "profile",
    },
    {
      title: "Set Your Goals",
      description: "What matters most to you?",
      content: "goals",
    },
    {
      title: "You're All Set! 🎉",
      description: "Ready to start your eco-journey",
      content: "complete",
    },
  ]

  const interests = [
    "Organic Products",
    "Zero Waste",
    "Local Sourcing",
    "Renewable Energy",
    "Sustainable Packaging",
    "Fair Trade",
    "Plant-Based",
    "Recycling",
  ]

  const goals = [
    "Reduce Carbon Footprint",
    "Save Money Long-term",
    "Support Local Business",
    "Minimize Plastic Use",
    "Eat Healthier",
    "Teach Kids Sustainability",
  ]

  const toggleInterest = (interest: string) => {
    setUserData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const toggleGoal = (goal: string) => {
    setUserData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter((g) => g !== goal) : [...prev.goals, goal],
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(userData)
    }
  }

  const skipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const renderStepContent = () => {
    const step = steps[currentStep]

    switch (step.content) {
      case "intro":
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <div className="text-6xl">🌍</div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Make Every Purchase Count</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Scan products to see their environmental impact, find better alternatives, and earn rewards for
                sustainable choices.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Scan className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Smart Scanning</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Gift className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Earn Rewards</p>
              </div>
            </div>
          </div>
        )

      case "video":
        return (
          <div className="space-y-4">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              {!isVideoPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-600 to-blue-600">
                  <Button
                    onClick={() => setIsVideoPlaying(true)}
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Play className="mr-2 h-6 w-6" />
                    Watch Guide (2:15)
                  </Button>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white space-y-4">
                    <div className="animate-pulse">
                      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Pause className="h-8 w-8" />
                      </div>
                      <p>Video: "How to Use EcoMart Scanner"</p>
                      <div className="w-64 h-2 bg-white/20 rounded-full mx-auto mt-2">
                        <div className="h-full bg-green-500 rounded-full w-1/3"></div>
                      </div>
                      <p className="text-sm text-gray-300">0:45 / 2:15</p>
                    </div>
                    <Button
                      onClick={() => setIsVideoPlaying(false)}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-gray-50 rounded">
                <CheckCircle className="h-4 w-4 text-green-500 mx-auto mb-1" />
                <p>Scan Products</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <TrendingUp className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                <p>View EcoScore</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <Recycle className="h-4 w-4 text-purple-500 mx-auto mb-1" />
                <p>Earn Points</p>
              </div>
            </div>
          </div>
        )

      case "profile":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Let's personalize your experience</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">What should we call you?</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={userData.name}
                  onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="location">Where do you shop? (Optional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="City, State"
                    className="pl-10"
                    value={userData.location}
                    onChange={(e) => setUserData((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label>What interests you most? (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {interests.map((interest) => (
                    <Button
                      key={interest}
                      variant={userData.interests.includes(interest) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleInterest(interest)}
                      className="text-xs h-auto py-2"
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case "goals":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">What are your sustainability goals?</h3>
              <p className="text-gray-600 text-sm">We'll help you track progress toward what matters most</p>
            </div>

            <div className="space-y-3">
              {goals.map((goal) => (
                <div
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    userData.goals.includes(goal)
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{goal}</span>
                    {userData.goals.includes(goal) && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome aboard, {userData.name || "Eco Warrior"}! 🎉</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                You're all set to start making a positive impact with every purchase. Let's scan your first product!
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🎁 Welcome Bonus</h3>
              <p className="text-green-700 text-sm">You've earned 100 EcoPoints just for joining!</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </div>
            <Badge variant="outline">
              {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="mt-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1">
                Back
              </Button>
            )}

            {currentStep < steps.length - 1 && (
              <Button variant="ghost" onClick={skipStep} className="flex-1">
                <SkipForward className="mr-2 h-4 w-4" />
                Skip
              </Button>
            )}

            <Button
              onClick={nextStep}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              disabled={currentStep === 2 && !userData.name.trim()}
            >
              {currentStep === steps.length - 1 ? "Start Shopping!" : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
