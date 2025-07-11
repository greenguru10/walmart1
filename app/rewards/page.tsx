"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, ArrowLeft, Star, DollarSign, Heart, Trophy, Zap } from "lucide-react"
import Link from "next/link"

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  type: "discount" | "cashback" | "donation" | "product"
  icon: any
  available: boolean
  category: string
}

export default function RewardsPage() {
  const [userStats, setUserStats] = useState({
    ecoPoints: 0,
    carbonSaved: 0,
    itemsRecycled: 0,
    level: 1,
  })

  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([])

  useEffect(() => {
    const savedStats = localStorage.getItem("ecoStats")
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }

    const savedRewards = localStorage.getItem("redeemedRewards")
    if (savedRewards) {
      setRedeemedRewards(JSON.parse(savedRewards))
    }
  }, [])

  // Update the rewards array to include more realistic options
  const rewards: Reward[] = [
    {
      id: "1",
      name: "$5 Off Next Purchase",
      description: "Get $5 off your next Walmart purchase of $25 or more",
      cost: 500,
      type: "discount",
      icon: DollarSign,
      available: userStats.ecoPoints >= 500,
      category: "shopping",
    },
    {
      id: "2",
      name: "$10 Walmart Gift Card",
      description: "Redeem for a $10 Walmart gift card",
      cost: 1000,
      type: "cashback",
      icon: Star,
      available: userStats.ecoPoints >= 1000,
      category: "shopping",
    },
    {
      id: "3",
      name: "Plant a Tree Donation",
      description: "Donate to plant a tree through our partner organization",
      cost: 250,
      type: "donation",
      icon: Heart,
      available: userStats.ecoPoints >= 250,
      category: "environment",
    },
    {
      id: "4",
      name: "$3 Off Organic Products",
      description: "Special discount on organic and sustainable products",
      cost: 300,
      type: "discount",
      icon: DollarSign,
      available: userStats.ecoPoints >= 300,
      category: "organic",
    },
    {
      id: "5",
      name: "$25 Walmart Gift Card",
      description: "Premium gift card reward for eco-champions",
      cost: 2500,
      type: "cashback",
      icon: Star,
      available: userStats.ecoPoints >= 2500,
      category: "shopping",
    },
    {
      id: "6",
      name: "Ocean Cleanup Donation",
      description: "Support ocean cleanup initiatives",
      cost: 750,
      type: "donation",
      icon: Heart,
      available: userStats.ecoPoints >= 750,
      category: "environment",
    },
    {
      id: "7",
      name: "Free Reusable Shopping Bag",
      description: "Get a premium eco-friendly shopping bag delivered free",
      cost: 400,
      type: "product",
      icon: Gift,
      available: userStats.ecoPoints >= 400,
      category: "eco-products",
    },
    {
      id: "8",
      name: "$50 Walmart Gift Card",
      description: "Ultimate reward for dedicated eco-warriors",
      cost: 5000,
      type: "cashback",
      icon: Star,
      available: userStats.ecoPoints >= 5000,
      category: "shopping",
    },
    {
      id: "9",
      name: "Carbon Offset Credits",
      description: "Offset 1 ton of CO₂ emissions",
      cost: 1500,
      type: "donation",
      icon: Heart,
      available: userStats.ecoPoints >= 1500,
      category: "environment",
    },
    {
      id: "10",
      name: "Eco-Starter Kit",
      description: "Bamboo utensils, reusable straws, and more",
      cost: 800,
      type: "product",
      icon: Gift,
      available: userStats.ecoPoints >= 800,
      category: "eco-products",
    },
  ]

  const achievements = [
    {
      name: "First Scanner",
      description: "Scanned your first product",
      icon: Trophy,
      unlocked: userStats.ecoPoints > 0,
      points: 50,
    },
    {
      name: "Eco Warrior",
      description: "Earned 1000 EcoPoints",
      icon: Zap,
      unlocked: userStats.ecoPoints >= 1000,
      points: 100,
    },
    {
      name: "Carbon Saver",
      description: "Saved 5kg of CO₂",
      icon: Trophy,
      unlocked: userStats.carbonSaved >= 5,
      points: 150,
    },
    {
      name: "Recycling Champion",
      description: "Recycled 10 items",
      icon: Trophy,
      unlocked: userStats.itemsRecycled >= 10,
      points: 200,
    },
  ]

  const redeemReward = (reward: Reward) => {
    if (reward.available && userStats.ecoPoints >= reward.cost) {
      const newStats = {
        ...userStats,
        ecoPoints: userStats.ecoPoints - reward.cost,
      }
      setUserStats(newStats)
      localStorage.setItem("ecoStats", JSON.stringify(newStats))

      const newRedeemed = [...redeemedRewards, reward.id]
      setRedeemedRewards(newRedeemed)
      localStorage.setItem("redeemedRewards", JSON.stringify(newRedeemed))

      alert(`Successfully redeemed: ${reward.name}! Check your Walmart account for details.`)
    }
  }

  const levelProgress = (userStats.ecoPoints % 1000) / 10

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">EcoRewards</h1>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {userStats.ecoPoints} Points
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Points Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-600" />
              Your EcoPoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-2xl font-bold text-green-600">{userStats.ecoPoints}</p>
                <p className="text-sm text-gray-600">Available Points</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">Level {userStats.level}</p>
                <p className="text-sm text-gray-600">Current Level</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{1000 - (userStats.ecoPoints % 1000)}</p>
                <p className="text-sm text-gray-600">Points to Next Level</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level Progress</span>
                <span>{Math.round(levelProgress)}%</span>
              </div>
              <Progress value={levelProgress} />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="rewards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <Card key={reward.id} className={`${!reward.available ? "opacity-50" : ""}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <reward.icon className="h-5 w-5 text-green-600" />
                        <div>
                          <CardTitle className="text-lg">{reward.name}</CardTitle>
                          <CardDescription>{reward.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={reward.type === "donation" ? "secondary" : "default"}>{reward.cost} pts</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => redeemReward(reward)}
                      disabled={!reward.available || redeemedRewards.includes(reward.id)}
                      className="w-full"
                    >
                      {redeemedRewards.includes(reward.id)
                        ? "Redeemed"
                        : reward.available
                          ? "Redeem Now"
                          : `Need ${reward.cost - userStats.ecoPoints} more points`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`${!achievement.unlocked ? "opacity-50" : ""}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <achievement.icon
                        className={`h-8 w-8 ${achievement.unlocked ? "text-yellow-500" : "text-gray-400"}`}
                      />
                      <div>
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="bg-yellow-100 text-yellow-800">+{achievement.points} pts</Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Impact Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{userStats.carbonSaved.toFixed(1)} kg</p>
                <p className="text-sm text-gray-600">CO₂ Saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{userStats.itemsRecycled}</p>
                <p className="text-sm text-gray-600">Items Recycled</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{redeemedRewards.length}</p>
                <p className="text-sm text-gray-600">Rewards Claimed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
