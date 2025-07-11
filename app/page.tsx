"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Logo } from "@/components/ui/logo"
import { WelcomeFlow } from "@/components/onboarding/welcome-flow"
import {
  Scan,
  Gift,
  Recycle,
  Trophy,
  TrendingUp,
  Camera,
  Award,
  Users,
  Play,
  Star,
  CheckCircle,
  Zap,
  User,
} from "lucide-react"

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [userStats, setUserStats] = useState({
    ecoPoints: 0,
    carbonSaved: 0,
    itemsRecycled: 0,
    level: 1,
  })
  const [showDemo, setShowDemo] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding")
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true)
    }

    // Load user stats
    const savedStats = localStorage.getItem("ecoStats")
    if (savedStats) {
      setUserStats(JSON.parse(savedStats))
    }
  }, [])

  const handleOnboardingComplete = (userData: any) => {
    localStorage.setItem("hasCompletedOnboarding", "true")
    localStorage.setItem("userData", JSON.stringify(userData))

    // Give welcome bonus
    const welcomeStats = {
      ecoPoints: 100,
      carbonSaved: 0,
      itemsRecycled: 0,
      level: 1,
    }
    setUserStats(welcomeStats)
    localStorage.setItem("ecoStats", JSON.stringify(welcomeStats))
    setShowOnboarding(false)
  }

  if (showOnboarding) {
    return <WelcomeFlow onComplete={handleOnboardingComplete} />
  }

  const levelProgress = (userStats.ecoPoints % 1000) / 10

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Award className="h-4 w-4 mr-1" />
              Level {userStats.level}
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-700">
              {userStats.ecoPoints} EcoPoints
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Over 50,000 products scanned this week!
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Shop Smart,
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                Live Green
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover the environmental impact of every product you buy. Make informed choices, earn rewards, and join
              a community of conscious shoppers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/scan">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
              >
                <Scan className="mr-2 h-5 w-5" />
                Start Scanning Now
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 hover:bg-gray-50 bg-transparent"
              onClick={() => setShowDemo(true)}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo (2 min)
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full border-2 border-white"
                  ></div>
                ))}
              </div>
              <span>Join 25,000+ eco-warriors</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-1">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Your Impact Dashboard</h2>
            <p className="text-gray-600">Track your progress toward a more sustainable lifestyle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">EcoPoints Earned</CardTitle>
                <Gift className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{userStats.ecoPoints}</div>
                <p className="text-xs text-muted-foreground">
                  {1000 - (userStats.ecoPoints % 1000)} points to next level
                </p>
                <Progress value={levelProgress} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{userStats.carbonSaved} kg</div>
                <p className="text-xs text-muted-foreground">CO₂ equivalent saved</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Items Recycled</CardTitle>
                <Recycle className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{userStats.itemsRecycled}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need for Sustainable Shopping</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From scanning products to tracking your impact, we've got all the tools to make eco-friendly choices easy
              and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Scan className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Smart Product Scanner</CardTitle>
                <CardDescription>
                  Instantly get sustainability ratings, ingredient analysis, and eco-friendly alternatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Works with any barcode
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Recycling Tracker</CardTitle>
                <CardDescription>
                  Upload photos of recycled items and get rewarded for your environmental actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-blue-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  AI-powered verification
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Gamified Challenges</CardTitle>
                <CardDescription>
                  Join weekly eco-challenges, compete with friends, and unlock achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-purple-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  New challenges weekly
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Rewards Program</CardTitle>
                <CardDescription>
                  Earn points for sustainable choices and redeem for discounts, cashback, or donations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-orange-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Real cash rewards
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-teal-100">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Community Hub</CardTitle>
                <CardDescription>
                  Connect with like-minded shoppers, share tips, and celebrate eco-wins together
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-teal-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  25,000+ active members
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-pink-50 to-pink-100">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Impact Analytics</CardTitle>
                <CardDescription>
                  Detailed insights into your environmental impact with shareable progress reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-pink-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Monthly impact reports
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-4 bg-gradient-to-r from-green-500 to-blue-600">
        <div className="container mx-auto">
          <div className="text-center text-white mb-8">
            <h2 className="text-2xl font-bold mb-2">Ready to Get Started?</h2>
            <p className="opacity-90">Choose your next action and start making a difference today</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/scan">
              <Card className="hover:shadow-lg transition-all cursor-pointer group bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Scan className="h-8 w-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium">Scan Product</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/recycling">
              <Card className="hover:shadow-lg transition-all cursor-pointer group bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Recycle className="h-8 w-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium">Log Recycling</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/community">
              <Card className="hover:shadow-lg transition-all cursor-pointer group bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium">Community</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/analytics">
              <Card className="hover:shadow-lg transition-all cursor-pointer group bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium">Analytics</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-2">
            <Link href="/" className="flex flex-col items-center py-2 text-green-600">
              <Logo variant="icon" size="sm" />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/scan" className="flex flex-col items-center py-2 text-gray-600 hover:text-green-600">
              <Scan className="h-6 w-6" />
              <span className="text-xs">Scanner</span>
            </Link>
            <Link href="/challenges" className="flex flex-col items-center py-2 text-gray-600 hover:text-green-600">
              <Trophy className="h-6 w-6" />
              <span className="text-xs">Challenges</span>
            </Link>
            <Link href="/rewards" className="flex flex-col items-center py-2 text-gray-600 hover:text-green-600">
              <Gift className="h-6 w-6" />
              <span className="text-xs">Rewards</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center py-2 text-gray-600 hover:text-green-600">
              <User className="h-6 w-6" />
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">How EcoMart Works</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDemo(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-600 to-blue-600">
                  <div className="text-center text-white space-y-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center">
                      <Play className="h-10 w-10" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2">EcoMart Demo Video</h4>
                      <p className="text-sm opacity-90 mb-4">
                        Learn how to scan products, earn rewards, and make sustainable choices
                      </p>
                      <div className="w-64 h-2 bg-white/20 rounded-full mx-auto">
                        <div className="h-full bg-green-400 rounded-full w-0 animate-pulse"></div>
                      </div>
                      <p className="text-xs mt-2 opacity-75">Demo video would play here</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Scan className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">1. Scan Products</p>
                  <p className="text-gray-600 text-xs">Point camera at barcode</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">2. View EcoScore</p>
                  <p className="text-gray-600 text-xs">See environmental impact</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Gift className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium">3. Earn Rewards</p>
                  <p className="text-gray-600 text-xs">Get points for eco choices</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowDemo(false)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Scan className="mr-2 h-4 w-4" />
                  Start Scanning Now
                </Button>
                <Button variant="outline" onClick={() => setShowDemo(false)} className="px-6">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
