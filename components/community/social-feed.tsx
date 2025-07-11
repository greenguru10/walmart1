"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share2, Camera, Users, Award, Leaf, Plus } from "lucide-react"

interface Post {
  id: string
  user: {
    name: string
    avatar: string
    level: number
  }
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  achievement?: {
    name: string
    icon: string
  }
  ecoImpact?: {
    carbonSaved: number
    pointsEarned: number
  }
}

export function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      user: {
        name: "Emma Green",
        avatar: "/placeholder.svg?height=40&width=40",
        level: 7,
      },
      content:
        "Just hit my goal of saving 50kg of CO₂ this year! 🌍 Every small choice adds up. What's your biggest eco-win this month?",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      achievement: {
        name: "Carbon Champion",
        icon: "🏆",
      },
      ecoImpact: {
        carbonSaved: 2.3,
        pointsEarned: 150,
      },
    },
    {
      id: "2",
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        level: 4,
      },
      content:
        "Switched to these amazing bamboo toothbrushes! EcoScore of 95/100 and they're actually better than my old plastic ones. Small changes, big impact! 🦷",
      image: "/placeholder.svg?height=200&width=300",
      timestamp: "5 hours ago",
      likes: 18,
      comments: 12,
      ecoImpact: {
        carbonSaved: 0.8,
        pointsEarned: 95,
      },
    },
    {
      id: "3",
      user: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        level: 6,
      },
      content:
        "Recycling haul from this week! 15 items properly sorted and recycled. The app made it so easy to know exactly where each item should go. ♻️",
      image: "/placeholder.svg?height=200&width=300",
      timestamp: "1 day ago",
      likes: 31,
      comments: 6,
      ecoImpact: {
        carbonSaved: 1.2,
        pointsEarned: 180,
      },
    },
  ])

  const [newPost, setNewPost] = useState("")
  const [showCreatePost, setShowCreatePost] = useState(false)

  const likePost = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  const createPost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now().toString(),
        user: {
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40",
          level: 5,
        },
        content: newPost,
        timestamp: "Just now",
        likes: 0,
        comments: 0,
      }
      setPosts([post, ...posts])
      setNewPost("")
      setShowCreatePost(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              EcoMart Community
            </h1>
            <Button
              onClick={() => setShowCreatePost(!showCreatePost)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Community Stats */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">Community Impact This Week</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">2,847</div>
                <div className="text-sm opacity-90">Products Scanned</div>
              </div>
              <div>
                <div className="text-2xl font-bold">156 kg</div>
                <div className="text-sm opacity-90">CO₂ Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold">1,234</div>
                <div className="text-sm opacity-90">Items Recycled</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Post */}
        {showCreatePost && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share Your Eco Journey</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's your latest sustainable choice? Share your eco-wins, tips, or questions!"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createPost} disabled={!newPost.trim()} className="bg-green-600 hover:bg-green-700">
                    Share Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{post.user.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          Level {post.user.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                  {post.achievement && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {post.achievement.icon} {post.achievement.name}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-800">{post.content}</p>

                {post.image && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Post content"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {post.ecoImpact && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-green-700">
                          <Leaf className="h-4 w-4" />
                          {post.ecoImpact.carbonSaved} kg CO₂ saved
                        </div>
                        <div className="flex items-center gap-1 text-blue-700">
                          <Award className="h-4 w-4" />+{post.ecoImpact.pointsEarned} points
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likePost(post.id)}
                      className="text-gray-600 hover:text-red-500"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline">Load More Posts</Button>
        </div>
      </div>
    </div>
  )
}
