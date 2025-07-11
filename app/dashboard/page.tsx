"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Leaf,
  Recycle,
  Trophy,
  Target,
  Calendar,
  BarChart3,
  Zap,
  ArrowUp,
  Clock,
  Users,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"
import { loadUserStats, getAchievementProgress, getLevelProgress, type UserStats } from "@/lib/user-stats"

export default function DashboardPage() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stats = loadUserStats()
    setUserStats(stats)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Start Your Eco Journey</h2>
            <p className="text-gray-600 mb-4">Scan your first product to begin tracking your sustainability impact!</p>
            <Link href="/scan">
              <Button className="w-full">
                <Zap className="mr-2 h-4 w-4" />
                Start Scanning
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const levelProgress = getLevelProgress(userStats)
  const achievementProgress = getAchievementProgress(userStats)
  const recentScans = userStats.scanHistory.slice(0, 5)

  // Calculate weekly stats (mock data for demo)
  const weeklyStats = {
    scansThisWeek: Math.floor(userStats.itemsScanned * 0.3),
    pointsThisWeek: Math.floor(userStats.ecoPoints * 0.2),
    carbonSavedThisWeek: userStats.carbonSaved * 0.25,
    streakDays: userStats.streak,
  }

  const weeklyChange = {
    scans: 15, // +15% from last week
    points: 23, // +23% from last week
    carbon: 8, // +8% from last week
    streak: userStats.streak > 0 ? 100 : 0, // New streak or continuing
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Eco Dashboard</h1>
              <p className="text-gray-600">Track your sustainable shopping journey</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                Level {userStats.level}
              </Badge>
              <Badge className="bg-blue-600 text-white px-3 py-1">{userStats.ecoPoints} Points</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Level Progress */}
        <Card className="bg-gradient-to-r from-green-100 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Level {levelProgress.currentLevel}</h3>
                <p className="text-sm text-gray-600">
                  {levelProgress.pointsToNext} points to Level {levelProgress.nextLevel}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{userStats.ecoPoints}</div>
                <div className="text-xs text-gray-600">Total EcoPoints</div>
              </div>
            </div>
            <Progress value={levelProgress.progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{userStats.itemsScanned}</div>
              <div className="text-xs text-gray-600">Items Scanned</div>
              <div className="flex items-center justify-center mt-1 text-xs">
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">+{weeklyChange.scans}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{userStats.carbonSaved.toFixed(1)}kg</div>
              <div className="text-xs text-gray-600">CO₂ Saved</div>
              <div className="flex items-center justify-center mt-1 text-xs">
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">+{weeklyChange.carbon}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Recycle className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{userStats.itemsRecycled}</div>
              <div className="text-xs text-gray-600">Items Recycled</div>
              <div className="flex items-center justify-center mt-1 text-xs">
                <Clock className="h-3 w-3 text-gray-500 mr-1" />
                <span className="text-gray-500">Track more</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
              <div className="text-xs text-gray-600">Day Streak</div>
              <div className="flex items-center justify-center mt-1 text-xs">
                {userStats.streak > 0 ? (
                  <>
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-500">Active!</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 text-gray-500 mr-1" />
                    <span className="text-gray-500">Start today</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Weekly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  This Week's Impact
                </CardTitle>
                <CardDescription>Your sustainability progress over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{weeklyStats.scansThisWeek}</div>
                    <div className="text-sm text-gray-600">Scans</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{weeklyStats.pointsThisWeek}</div>
                    <div className="text-sm text-gray-600">Points</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {weeklyStats.carbonSavedThisWeek.toFixed(1)}kg
                    </div>
                    <div className="text-sm text-gray-600">CO₂ Saved</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{weeklyStats.streakDays}</div>
                    <div className="text-sm text-gray-600">Streak Days</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Continue your eco journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/scan">
                    <Button className="w-full h-20 flex flex-col gap-2">
                      <Zap className="h-6 w-6" />
                      <span className="text-sm">Scan Product</span>
                    </Button>
                  </Link>
                  <Link href="/recycling">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                      <Recycle className="h-6 w-6" />
                      <span className="text-sm">Find Recycling</span>
                    </Button>
                  </Link>
                  <Link href="/challenges">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                      <Trophy className="h-6 w-6" />
                      <span className="text-sm">Challenges</span>
                    </Button>
                  </Link>
                  <Link href="/community">
                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                      <Users className="h-6 w-6" />
                      <span className="text-sm">Community</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements ({userStats.achievements.length}/6)
                </CardTitle>
                <CardDescription>Track your progress towards sustainability milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievementProgress.map(({ achievement, progress, unlocked }) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{achievement.name}</h4>
                          {unlocked && <Badge className="bg-green-100 text-green-800">Unlocked</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <div className="flex items-center gap-2">
                          <Progress value={progress} className="flex-1 h-2" />
                          <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">+{achievement.pointsReward}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest scans and purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {recentScans.length > 0 ? (
                  <div className="space-y-3">
                    {recentScans.map((scan) => (
                      <div key={scan.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            {scan.action === "scanned" && <BarChart3 className="h-4 w-4 text-green-600" />}
                            {scan.action === "purchased" && <ShoppingCart className="h-4 w-4 text-blue-600" />}
                            {scan.action === "recycled" && <Recycle className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div>
                            <div className="font-medium">{scan.productName}</div>
                            <div className="text-sm text-gray-600">
                              EcoScore: {scan.ecoscore}/5 • {new Date(scan.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">+{scan.pointsEarned}</div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No activity yet. Start scanning to see your history!</p>
                    <Link href="/scan">
                      <Button className="mt-4">
                        <Zap className="mr-2 h-4 w-4" />
                        Scan Your First Product
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Sustainability Goals
                </CardTitle>
                <CardDescription>Set and track your environmental impact goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Monthly Goals */}
                  <div>
                    <h4 className="font-semibold mb-3">Monthly Goals</h4>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Scan 30 Products</span>
                          <span className="text-sm text-gray-600">{userStats.itemsScanned}/30</span>
                        </div>
                        <Progress value={(userStats.itemsScanned / 30) * 100} className="h-2" />
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Save 10kg CO₂</span>
                          <span className="text-sm text-gray-600">{userStats.carbonSaved.toFixed(1)}/10kg</span>
                        </div>
                        <Progress value={(userStats.carbonSaved / 10) * 100} className="h-2" />
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Maintain 7-Day Streak</span>
                          <span className="text-sm text-gray-600">{userStats.streak}/7 days</span>
                        </div>
                        <Progress value={(userStats.streak / 7) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Impact Summary */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Your Environmental Impact</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-green-600 font-bold">{userStats.sustainableChoices}</div>
                        <div className="text-green-700">Sustainable Choices</div>
                      </div>
                      <div>
                        <div className="text-green-600 font-bold">{(userStats.carbonSaved * 2.2).toFixed(1)} lbs</div>
                        <div className="text-green-700">CO₂ Equivalent</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
