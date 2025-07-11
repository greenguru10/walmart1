"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  Leaf,
  Recycle,
  Car,
  TreePine,
  Droplets,
  Zap,
  Target,
  Share2,
  Download,
  ArrowLeft,
  Lightbulb,
  Users,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for charts
  const carbonData = [
    { month: "Aug", saved: 2.1, target: 3.0 },
    { month: "Sep", saved: 3.2, target: 3.5 },
    { month: "Oct", saved: 4.1, target: 4.0 },
    { month: "Nov", saved: 3.8, target: 4.5 },
    { month: "Dec", saved: 5.2, target: 5.0 },
    { month: "Jan", saved: 6.1, target: 5.5 },
  ]

  const categoryData = [
    { name: "Food & Beverages", value: 45, color: "#10B981" },
    { name: "Personal Care", value: 25, color: "#3B82F6" },
    { name: "Household Items", value: 20, color: "#8B5CF6" },
    { name: "Electronics", value: 10, color: "#F59E0B" },
  ]

  const weeklyActivity = [
    { day: "Mon", scans: 3, recycling: 1 },
    { day: "Tue", scans: 5, recycling: 2 },
    { day: "Wed", scans: 2, recycling: 0 },
    { day: "Thu", scans: 7, recycling: 3 },
    { day: "Fri", scans: 4, recycling: 1 },
    { day: "Sat", scans: 8, recycling: 4 },
    { day: "Sun", scans: 6, recycling: 2 },
  ]

  const impactMetrics = {
    carbonSaved: 24.5,
    carbonTarget: 30,
    itemsRecycled: 127,
    plasticAvoided: 89,
    waterSaved: 1250,
    energySaved: 45,
    treesEquivalent: 3.2,
    milesNotDriven: 156,
  }

  const insights = [
    {
      type: "achievement",
      title: "Great Progress!",
      description: "You're 82% towards your monthly carbon reduction goal",
      icon: <Target className="h-5 w-5 text-green-600" />,
      action: "View Goals",
    },
    {
      type: "suggestion",
      title: "Try Local Shopping",
      description: "Shopping locally could reduce your carbon footprint by 15%",
      icon: <Lightbulb className="h-5 w-5 text-yellow-600" />,
      action: "Find Stores",
    },
    {
      type: "community",
      title: "Community Impact",
      description: "You're in the top 25% of eco-warriors in your area!",
      icon: <Users className="h-5 w-5 text-blue-600" />,
      action: "View Leaderboard",
    },
  ]

  const goals = [
    { name: "Reduce Carbon Footprint", current: 24.5, target: 30, unit: "kg CO₂", progress: 82 },
    { name: "Recycle Items", current: 127, target: 150, unit: "items", progress: 85 },
    { name: "Avoid Plastic", current: 89, target: 100, unit: "items", progress: 89 },
    { name: "Save Water", current: 1250, target: 1500, unit: "liters", progress: 83 },
  ]

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
                <h1 className="text-xl font-bold">Impact Analytics</h1>
                <p className="text-sm text-gray-600">Track your environmental impact over time</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-2 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Carbon Saved</p>
                      <p className="text-2xl font-bold text-green-600">{impactMetrics.carbonSaved}</p>
                      <p className="text-xs text-gray-500">kg CO₂</p>
                    </div>
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+12% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Items Recycled</p>
                      <p className="text-2xl font-bold text-blue-600">{impactMetrics.itemsRecycled}</p>
                      <p className="text-xs text-gray-500">this month</p>
                    </div>
                    <Recycle className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-blue-600">+8% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Plastic Avoided</p>
                      <p className="text-2xl font-bold text-purple-600">{impactMetrics.plasticAvoided}</p>
                      <p className="text-xs text-gray-500">items</p>
                    </div>
                    <Droplets className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-purple-600 mr-1" />
                    <span className="text-purple-600">+15% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Energy Saved</p>
                      <p className="text-2xl font-bold text-orange-600">{impactMetrics.energySaved}</p>
                      <p className="text-xs text-gray-500">kWh</p>
                    </div>
                    <Zap className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-orange-600 mr-1" />
                    <span className="text-orange-600">+5% from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-World Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  Real-World Impact
                </CardTitle>
                <CardDescription>Your environmental actions translated into real-world equivalents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <TreePine className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{impactMetrics.treesEquivalent}</p>
                    <p className="text-sm text-gray-600">Trees planted equivalent</p>
                  </div>
                  <div className="text-center">
                    <Car className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{impactMetrics.milesNotDriven}</p>
                    <p className="text-sm text-gray-600">Miles not driven</p>
                  </div>
                  <div className="text-center">
                    <Droplets className="h-12 w-12 text-cyan-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-cyan-600">{impactMetrics.waterSaved.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Liters of water saved</p>
                  </div>
                  <div className="text-center">
                    <Recycle className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{impactMetrics.plasticAvoided}</p>
                    <p className="text-sm text-gray-600">Plastic bottles avoided</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Impact by Category</CardTitle>
                  <CardDescription>Where you're making the biggest difference</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Your eco-actions throughout the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="scans" fill="#10B981" name="Product Scans" />
                      <Bar dataKey="recycling" fill="#3B82F6" name="Recycling Actions" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Footprint Reduction</CardTitle>
                <CardDescription>Track your progress towards carbon neutrality</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={carbonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="saved"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                      name="Carbon Saved (kg)"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#EF4444"
                      strokeDasharray="5 5"
                      name="Monthly Target"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <CardDescription>
                      {goal.current} / {goal.target} {goal.unit}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={goal.progress} className="h-3" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{goal.progress}% complete</span>
                        <span className="font-semibold">
                          {goal.target - goal.current} {goal.unit} to go
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Adjust Goal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">{insight.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{insight.title}</h3>
                        <p className="text-gray-600 mb-3">{insight.description}</p>
                        <Button variant="outline" size="sm">
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* AI Recommendations */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions based on your shopping patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold mb-2">🛒 Smart Shopping Tip</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Based on your purchase history, switching to bulk buying for household items could reduce your
                    packaging waste by 30%.
                  </p>
                  <Button size="sm">Find Bulk Stores</Button>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold mb-2">🌱 Eco Alternative</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    You frequently buy conventional cleaning products. Eco-friendly alternatives could reduce your
                    chemical footprint by 45%.
                  </p>
                  <Button size="sm">Browse Alternatives</Button>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-semibold mb-2">🚗 Transportation Impact</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Consolidating your shopping trips could save an additional 5kg CO₂ per month.
                  </p>
                  <Button size="sm">Plan Shopping Route</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
