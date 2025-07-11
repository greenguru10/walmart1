"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Trophy,
  ArrowLeft,
  Target,
  Users,
  Star,
  Zap,
  Award,
  Clock,
  CheckCircle,
  Play,
  Gift,
  Flame,
  Crown,
  Medal,
} from "lucide-react"
import Link from "next/link"

interface Challenge {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "monthly" | "special"
  difficulty: "easy" | "medium" | "hard"
  target: number
  current: number
  reward: number
  participants: number
  timeLeft: string
  icon: any
  completed: boolean
  category: "scanning" | "recycling" | "community" | "shopping"
}

interface TeamChallenge {
  id: string
  name: string
  description: string
  members: number
  maxMembers: number
  progress: number
  target: number
  reward: number
  timeLeft: string
  isJoined: boolean
}

export default function ChallengesPage() {
  const [userStats, setUserStats] = useState({
    ecoPoints: 2450,
    level: 5,
    challengesCompleted: 23,
    currentStreak: 7,
  })

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Daily Scanner",
      description: "Scan 3 products today",
      type: "daily",
      difficulty: "easy",
      target: 3,
      current: 1,
      reward: 50,
      participants: 1247,
      timeLeft: "18h",
      icon: Target,
      completed: false,
      category: "scanning",
    },
    {
      id: "2",
      title: "Eco Shopper",
      description: "Buy 5 products with EcoScore > 80",
      type: "weekly",
      difficulty: "medium",
      target: 5,
      current: 2,
      reward: 200,
      participants: 856,
      timeLeft: "4d",
      icon: Star,
      completed: false,
      category: "shopping",
    },
    {
      id: "3",
      title: "Recycling Hero",
      description: "Recycle 10 items this week",
      type: "weekly",
      difficulty: "medium",
      target: 10,
      current: 6,
      reward: 150,
      participants: 623,
      timeLeft: "4d",
      icon: Trophy,
      completed: false,
      category: "recycling",
    },
    {
      id: "4",
      title: "Carbon Warrior",
      description: "Save 5kg of CO₂ this month",
      type: "monthly",
      difficulty: "hard",
      target: 5,
      current: 2.3,
      reward: 500,
      participants: 2341,
      timeLeft: "12d",
      icon: Zap,
      completed: false,
      category: "shopping",
    },
    {
      id: "5",
      title: "Community Champion",
      description: "Share 3 eco-tips in the community",
      type: "weekly",
      difficulty: "easy",
      target: 3,
      current: 1,
      reward: 100,
      participants: 445,
      timeLeft: "4d",
      icon: Users,
      completed: false,
      category: "community",
    },
    {
      id: "6",
      title: "Earth Day Special",
      description: "Complete 10 sustainable actions",
      type: "special",
      difficulty: "hard",
      target: 10,
      current: 7,
      reward: 1000,
      participants: 5678,
      timeLeft: "2d",
      icon: Award,
      completed: false,
      category: "shopping",
    },
  ])

  const [teamChallenges, setTeamChallenges] = useState<TeamChallenge[]>([
    {
      id: "team1",
      name: "Green Warriors",
      description: "Collectively save 100kg of CO₂",
      members: 23,
      maxMembers: 25,
      progress: 67.5,
      target: 100,
      reward: 2000,
      timeLeft: "5d",
      isJoined: true,
    },
    {
      id: "team2",
      name: "Eco Avengers",
      description: "Recycle 500 items as a team",
      members: 18,
      maxMembers: 20,
      progress: 342,
      target: 500,
      reward: 1500,
      timeLeft: "8d",
      isJoined: false,
    },
    {
      id: "team3",
      name: "Sustainable Squad",
      description: "Scan 1000 products together",
      members: 15,
      maxMembers: 30,
      progress: 756,
      target: 1000,
      reward: 1200,
      timeLeft: "6d",
      isJoined: false,
    },
  ])

  const [leaderboard] = useState([
    { rank: 1, name: "EcoMaster", points: 15420, avatar: "/placeholder.svg?height=40&width=40" },
    { rank: 2, name: "GreenGuru", points: 12890, avatar: "/placeholder.svg?height=40&width=40" },
    { rank: 3, name: "SustainableSteve", points: 11250, avatar: "/placeholder.svg?height=40&width=40" },
    { rank: 4, name: "You", points: userStats.ecoPoints, avatar: "/placeholder.svg?height=40&width=40", isUser: true },
    { rank: 5, name: "RecycleQueen", points: 8750, avatar: "/placeholder.svg?height=40&width=40" },
  ])

  const joinChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, current: Math.min(challenge.current + 1, challenge.target) }
          : challenge,
      ),
    )
    alert("Challenge progress updated! Keep going!")
  }

  const joinTeamChallenge = (teamId: string) => {
    setTeamChallenges((prev) =>
      prev.map((team) => (team.id === teamId ? { ...team, isJoined: true, members: team.members + 1 } : team)),
    )
    alert("Successfully joined the team challenge!")
  }

  const claimReward = (challenge: Challenge) => {
    if (challenge.current >= challenge.target) {
      const newStats = {
        ...userStats,
        ecoPoints: userStats.ecoPoints + challenge.reward,
        challengesCompleted: userStats.challengesCompleted + 1,
      }
      setUserStats(newStats)
      localStorage.setItem("ecoStats", JSON.stringify(newStats))

      setChallenges((prev) => prev.map((c) => (c.id === challenge.id ? { ...c, completed: true } : c)))

      alert(`Congratulations! You earned ${challenge.reward} EcoPoints!`)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-blue-100 text-blue-800"
      case "weekly":
        return "bg-green-100 text-green-800"
      case "monthly":
        return "bg-purple-100 text-purple-800"
      case "special":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const activeChallenges = challenges.filter((c) => !c.completed)
  const completedChallenges = challenges.filter((c) => c.completed)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Eco Challenges</h1>
            </div>
            <Badge className="bg-white/20 text-white border-white/30">Level {userStats.level}</Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{activeChallenges.length}</div>
              <div className="text-sm opacity-90">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.challengesCompleted}</div>
              <div className="text-sm opacity-90">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.currentStreak}</div>
              <div className="text-sm opacity-90">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">#{leaderboard.find((l) => l.isUser)?.rank || "N/A"}</div>
              <div className="text-sm opacity-90">Rank</div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {/* Featured Challenge */}
            <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-orange-800">🌍 Earth Day Special</CardTitle>
                      <CardDescription className="text-orange-600">
                        Limited time challenge with mega rewards!
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-orange-500 text-white">SPECIAL</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Complete 10 sustainable actions</span>
                      <span>7/10</span>
                    </div>
                    <Progress value={70} className="h-3" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />2 days left
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        5,678 participants
                      </span>
                    </div>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      <Play className="mr-2 h-4 w-4" />
                      Continue (+1000 pts)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regular Challenges */}
            <div className="space-y-4">
              {activeChallenges
                .filter((c) => c.type !== "special")
                .map((challenge) => (
                  <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <challenge.icon className="h-6 w-6 text-green-600" />
                          <div>
                            <CardTitle className="text-lg">{challenge.title}</CardTitle>
                            <CardDescription>{challenge.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getTypeColor(challenge.type)}>{challenge.type}</Badge>
                          <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>
                              {challenge.current}/{challenge.target}
                            </span>
                          </div>
                          <Progress value={(challenge.current / challenge.target) * 100} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {challenge.timeLeft}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {challenge.participants}
                            </span>
                            <span className="flex items-center gap-1">
                              <Gift className="h-4 w-4" />
                              {challenge.reward} pts
                            </span>
                          </div>
                          {challenge.current >= challenge.target ? (
                            <Button onClick={() => claimReward(challenge)} className="bg-green-600 hover:bg-green-700">
                              <Trophy className="mr-2 h-4 w-4" />
                              Claim Reward
                            </Button>
                          ) : (
                            <Button variant="outline" onClick={() => joinChallenge(challenge.id)}>
                              Continue
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Team Challenges</h2>
              <p className="text-gray-600">Join forces with other eco-warriors for bigger impact!</p>
            </div>

            {teamChallenges.map((team) => (
              <Card key={team.id} className={team.isJoined ? "border-green-200 bg-green-50" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <CardDescription>{team.description}</CardDescription>
                      </div>
                    </div>
                    {team.isJoined && <Badge className="bg-green-100 text-green-800">Joined</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Team Progress</span>
                        <span>
                          {team.progress}/{team.target}
                        </span>
                      </div>
                      <Progress value={(team.progress / team.target) * 100} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {team.members}/{team.maxMembers} members
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {team.timeLeft} left
                        </span>
                        <span className="flex items-center gap-1">
                          <Gift className="h-4 w-4" />
                          {team.reward} pts each
                        </span>
                      </div>
                      {team.isJoined ? (
                        <Button variant="outline" disabled>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Joined
                        </Button>
                      ) : (
                        <Button
                          onClick={() => joinTeamChallenge(team.id)}
                          disabled={team.members >= team.maxMembers}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Join Team
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Challenge Champions
                </CardTitle>
                <CardDescription>Top performers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        entry.isUser ? "bg-green-50 border border-green-200" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            entry.rank === 1
                              ? "bg-yellow-500 text-white"
                              : entry.rank === 2
                                ? "bg-gray-400 text-white"
                                : entry.rank === 3
                                  ? "bg-orange-500 text-white"
                                  : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {entry.rank <= 3 ? <Medal className="h-4 w-4" /> : entry.rank}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.name} />
                          <AvatarFallback>{entry.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className={`font-medium ${entry.isUser ? "text-green-700" : ""}`}>{entry.name}</p>
                          {entry.isUser && <p className="text-xs text-green-600">That's you!</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={entry.isUser ? "default" : "secondary"}>
                          {entry.points.toLocaleString()} pts
                        </Badge>
                        {entry.rank <= 3 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {entry.rank === 1 ? "🥇 Champion" : entry.rank === 2 ? "🥈 Runner-up" : "🥉 Third place"}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Weekly Rewards
                </CardTitle>
                <CardDescription>Bonus rewards for top performers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-2xl mb-2">🥇</div>
                    <div className="font-bold text-yellow-800">1st Place</div>
                    <div className="text-sm text-yellow-600">$50 Gift Card</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl mb-2">🥈</div>
                    <div className="font-bold text-gray-800">2nd Place</div>
                    <div className="text-sm text-gray-600">$25 Gift Card</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-2xl mb-2">🥉</div>
                    <div className="font-bold text-orange-800">3rd Place</div>
                    <div className="text-sm text-orange-600">$10 Gift Card</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedChallenges.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No completed challenges yet.</p>
                  <p className="text-sm text-gray-400">Complete challenges to see them here!</p>
                </CardContent>
              </Card>
            ) : (
              completedChallenges.map((challenge) => (
                <Card key={challenge.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <challenge.icon className="h-6 w-6 text-green-600" />
                        <div>
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <CardDescription>{challenge.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Reward: {challenge.reward} EcoPoints</div>
                      <Badge variant="outline">✓ Claimed</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
