"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Settings,
  Award,
  TrendingUp,
  Calendar,
  MapPin,
  Edit3,
  Share2,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
} from "lucide-react"

interface UserData {
  name: string
  email: string
  location: string
  joinDate: string
  avatar: string
  level: number
  ecoPoints: number
  carbonSaved: number
  itemsRecycled: number
  streak: number
  achievements: Array<{
    id: string
    name: string
    description: string
    icon: string
    earnedDate: string
  }>
}

export function UserProfile() {
  const [userData, setUserData] = useState<UserData>({
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    location: "Austin, TX",
    joinDate: "2024-01-15",
    avatar: "/placeholder.svg?height=100&width=100",
    level: 5,
    ecoPoints: 2450,
    carbonSaved: 12.3,
    itemsRecycled: 47,
    streak: 12,
    achievements: [
      {
        id: "1",
        name: "First Scanner",
        description: "Scanned your first product",
        icon: "🎯",
        earnedDate: "2024-01-15",
      },
      {
        id: "2",
        name: "Eco Warrior",
        description: "Earned 1000 EcoPoints",
        icon: "⚡",
        earnedDate: "2024-02-20",
      },
      {
        id: "3",
        name: "Green Streak",
        description: "10 days of sustainable shopping",
        icon: "🔥",
        earnedDate: "2024-03-01",
      },
    ],
  })

  const levelProgress = (userData.ecoPoints % 500) / 5
  const nextLevelPoints = 500 - (userData.ecoPoints % 500)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20 border-4 border-white/20">
              <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
              <AvatarFallback className="bg-white/20 text-white text-xl">
                {userData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="text-white/80 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {userData.location}
              </p>
              <p className="text-white/60 text-sm">Member since {new Date(userData.joinDate).toLocaleDateString()}</p>
            </div>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>

          {/* Level Progress */}
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Level {userData.level} Eco Champion</span>
                <Badge className="bg-white/20 text-white border-white/30">{userData.ecoPoints} points</Badge>
              </div>
              <Progress value={levelProgress} className="mb-2 bg-white/20" />
              <p className="text-sm text-white/80">
                {nextLevelPoints} points to Level {userData.level + 1}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="achievements">Awards</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{userData.carbonSaved} kg</div>
                  <p className="text-sm text-gray-600">CO₂ Saved</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{userData.itemsRecycled}</div>
                  <p className="text-sm text-gray-600">Items Recycled</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{userData.streak}</div>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">#{Math.floor(Math.random() * 100) + 1}</div>
                  <p className="text-sm text-gray-600">Local Rank</p>
                </CardContent>
              </Card>
            </div>

            {/* Impact Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Your Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">🌱 This Month</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">3.2 kg</div>
                        <div className="text-xs text-green-700">CO₂ Saved</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">15</div>
                        <div className="text-xs text-green-700">Products Scanned</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">8</div>
                        <div className="text-xs text-green-700">Items Recycled</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 font-medium">Your choices have saved the equivalent of:</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      🚗 {(userData.carbonSaved * 2.3).toFixed(0)} miles not driven
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.achievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress toward next achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Next Achievements</CardTitle>
                <CardDescription>Keep going to unlock these rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl opacity-50">🏆</div>
                    <div>
                      <p className="font-medium">Carbon Hero</p>
                      <p className="text-sm text-gray-600">Save 20kg of CO₂</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{userData.carbonSaved}/20 kg</p>
                    <Progress value={(userData.carbonSaved / 20) * 100} className="w-20 mt-1" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl opacity-50">🔥</div>
                    <div>
                      <p className="font-medium">Streak Master</p>
                      <p className="text-sm text-gray-600">30-day shopping streak</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{userData.streak}/30 days</p>
                    <Progress value={(userData.streak / 30) * 100} className="w-20 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Scanned organic pasta sauce", points: 15, time: "2 hours ago", icon: "🍝" },
                    { action: "Recycled 3 plastic bottles", points: 30, time: "1 day ago", icon: "♻️" },
                    { action: "Chose eco-friendly detergent", points: 25, time: "2 days ago", icon: "🧽" },
                    { action: "Completed weekly challenge", points: 100, time: "3 days ago", icon: "🏆" },
                    { action: "Scanned LED light bulbs", points: 20, time: "4 days ago", icon: "💡" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{activity.icon}</div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.time}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">+{activity.points} pts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Bell className="mr-2 h-4 w-4" />
                    Notification Preferences
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Shield className="mr-2 h-4 w-4" />
                    Privacy Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    App Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Award className="mr-2 h-4 w-4" />
                    Goal Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MapPin className="mr-2 h-4 w-4" />
                    Location Preferences
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support & Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help & FAQ
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share App
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
