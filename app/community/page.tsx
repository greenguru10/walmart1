"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  MessageCircle,
  Share2,
  Users,
  TrendingUp,
  Award,
  Camera,
  Send,
  Search,
  Filter,
  MapPin,
  Calendar,
  Leaf,
  Recycle,
  Trophy,
  Target,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function CommunityPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { name: "Sarah Chen", avatar: "/placeholder.svg?height=40&width=40", location: "Seattle, WA", level: 12 },
      content:
        "Just hit my goal of 50 recycled items this month! 🌱 The new recycling center downtown makes it so much easier. Who else is crushing their sustainability goals?",
      image: "/placeholder.svg?height=200&width=300",
      likes: 24,
      comments: 8,
      shares: 3,
      timestamp: "2 hours ago",
      tags: ["recycling", "goals", "community"],
      achievement: "Recycling Champion",
    },
    {
      id: 2,
      user: { name: "Mike Rodriguez", avatar: "/placeholder.svg?height=40&width=40", location: "Austin, TX", level: 8 },
      content:
        "Found an amazing zero-waste store today! They have bulk everything and the prices are actually competitive with regular stores. Saved 15 plastic containers just on this trip! 💪",
      likes: 31,
      comments: 12,
      shares: 7,
      timestamp: "4 hours ago",
      tags: ["zero-waste", "shopping", "plastic-free"],
      carbonSaved: "2.3 kg CO₂",
    },
    {
      id: 3,
      user: {
        name: "Emma Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "Portland, OR",
        level: 15,
      },
      content:
        "Week 3 of the plastic-free challenge and I'm loving the creativity it's forcing! Made my own cleaning products and they work better than store-bought. Recipe in comments! 🧽✨",
      likes: 45,
      comments: 18,
      shares: 12,
      timestamp: "6 hours ago",
      tags: ["plastic-free", "DIY", "cleaning"],
      challenge: "Plastic-Free February",
    },
  ])

  const [newPost, setNewPost] = useState("")
  const [activeTab, setActiveTab] = useState("feed")

  const communityStats = {
    totalMembers: 25847,
    activeToday: 1234,
    postsToday: 89,
    carbonSavedCommunity: 12450,
  }

  const trendingTopics = [
    { tag: "zero-waste", posts: 156, growth: "+12%" },
    { tag: "plastic-free", posts: 134, growth: "+8%" },
    { tag: "local-shopping", posts: 98, growth: "+15%" },
    { tag: "recycling", posts: 87, growth: "+5%" },
    { tag: "sustainable-fashion", posts: 76, growth: "+22%" },
  ]

  const handleLike = (postId: number) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  const handleShare = (postId: number) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, shares: post.shares + 1 } : post)))
  }

  const submitPost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        user: { name: "You", avatar: "/placeholder.svg?height=40&width=40", location: "Your City", level: 5 },
        content: newPost,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: "Just now",
        tags: ["community"],
      }
      setPosts([post, ...posts])
      setNewPost("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Community</h1>
                <p className="text-sm text-gray-600">{communityStats.activeToday.toLocaleString()} active today</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Members</span>
                  <span className="font-semibold">{communityStats.totalMembers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Today</span>
                  <span className="font-semibold text-green-600">{communityStats.activeToday.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Posts Today</span>
                  <span className="font-semibold">{communityStats.postsToday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">CO₂ Saved</span>
                  <span className="font-semibold text-blue-600">
                    {communityStats.carbonSavedCommunity.toLocaleString()} kg
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">#{topic.tag}</span>
                      <p className="text-xs text-gray-600">{topic.posts} posts</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {topic.growth}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feed">Community Feed</TabsTrigger>
                <TabsTrigger value="challenges">Group Challenges</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="space-y-6">
                {/* Create Post */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Share Your Eco Journey</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="What sustainable action did you take today? Share your wins, tips, or questions with the community..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Photo
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          Location
                        </Button>
                      </div>
                      <Button onClick={submitPost} disabled={!newPost.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-6">
                  {posts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        {/* Post Header */}
                        <div className="flex items-start gap-3 mb-4">
                          <Avatar>
                            <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{post.user.name}</span>
                              <Badge variant="outline" className="text-xs">
                                Level {post.user.level}
                              </Badge>
                              {post.achievement && (
                                <Badge className="text-xs bg-yellow-100 text-yellow-800">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  {post.achievement}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-3 w-3" />
                              {post.user.location}
                              <span>•</span>
                              <Calendar className="h-3 w-3" />
                              {post.timestamp}
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <p className="mb-4 text-gray-800">{post.content}</p>

                        {/* Post Image */}
                        {post.image && (
                          <div className="mb-4 rounded-lg overflow-hidden">
                            <img
                              src={post.image || "/placeholder.svg"}
                              alt="Post image"
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}

                        {/* Post Metrics */}
                        <div className="flex gap-4 mb-4">
                          {post.carbonSaved && (
                            <div className="flex items-center gap-1 text-sm text-green-600">
                              <Leaf className="h-4 w-4" />
                              {post.carbonSaved} saved
                            </div>
                          )}
                          {post.challenge && (
                            <div className="flex items-center gap-1 text-sm text-purple-600">
                              <Target className="h-4 w-4" />
                              {post.challenge}
                            </div>
                          )}
                        </div>

                        {/* Post Tags */}
                        <div className="flex gap-2 mb-4">
                          {post.tags?.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex gap-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className="text-gray-600 hover:text-red-600"
                            >
                              <Heart className="h-4 w-4 mr-2" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              {post.comments}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare(post.id)}
                              className="text-gray-600 hover:text-green-600"
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              {post.shares}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="challenges" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-green-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Recycle className="h-5 w-5 text-green-600" />
                          Plastic-Free February
                        </CardTitle>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <CardDescription>Join 2,847 members in reducing plastic waste this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Community Progress</span>
                          <span className="font-semibold">73%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "73%" }}></div>
                        </div>
                        <div className="text-sm text-gray-600">12,450 plastic items avoided • 3 days left</div>
                        <Button className="w-full">Join Challenge</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-600" />
                          Local Shopping Week
                        </CardTitle>
                        <Badge variant="outline">Starting Soon</Badge>
                      </div>
                      <CardDescription>Support local businesses and reduce transportation emissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">Starts in 2 days • 1,234 members interested</div>
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span>Earn 500 bonus points</span>
                        </div>
                        <Button variant="outline" className="w-full bg-transparent">
                          Get Notified
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "First Scan", description: "Scanned your first product", icon: "🔍", earned: true },
                    { title: "Eco Warrior", description: "Saved 10kg of CO₂", icon: "🌱", earned: true },
                    { title: "Community Helper", description: "Helped 5 community members", icon: "🤝", earned: false },
                    { title: "Recycling Champion", description: "Recycled 50 items", icon: "♻️", earned: true },
                    { title: "Plastic-Free Hero", description: "Avoided 100 plastic items", icon: "🚫", earned: false },
                    { title: "Local Supporter", description: "Shopped local 20 times", icon: "🏪", earned: false },
                  ].map((achievement, index) => (
                    <Card
                      key={index}
                      className={`${achievement.earned ? "border-green-200 bg-green-50" : "border-gray-200"}`}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">{achievement.icon}</div>
                        <h3 className="font-semibold mb-2">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                        {achievement.earned ? (
                          <Badge className="bg-green-100 text-green-800">Earned</Badge>
                        ) : (
                          <Badge variant="outline">Locked</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
