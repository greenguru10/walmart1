"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Gift,
  Trophy,
  Leaf,
  Users,
  Settings,
  Check,
  X,
  ArrowLeft,
  BellRing,
  Volume2,
  VolumeX,
} from "lucide-react"
import Link from "next/link"

interface Notification {
  id: string
  type: "reward" | "challenge" | "achievement" | "community" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "achievement",
      title: "New Achievement Unlocked! 🏆",
      message: "You've earned the 'Eco Warrior' achievement for reaching 1000 EcoPoints!",
      timestamp: "2 hours ago",
      read: false,
      actionUrl: "/profile",
    },
    {
      id: "2",
      type: "challenge",
      title: "Challenge Reminder",
      message: "Don't forget to complete your daily scanning challenge. Only 2 scans left!",
      timestamp: "4 hours ago",
      read: false,
      actionUrl: "/challenges",
    },
    {
      id: "3",
      type: "reward",
      title: "Reward Available! 🎁",
      message: "You have enough points to redeem a $10 Walmart gift card!",
      timestamp: "1 day ago",
      read: true,
      actionUrl: "/rewards",
    },
    {
      id: "4",
      type: "community",
      title: "New Community Post",
      message: "Sarah shared an amazing recycling tip that earned 50 likes!",
      timestamp: "1 day ago",
      read: true,
      actionUrl: "/community",
    },
    {
      id: "5",
      type: "system",
      title: "App Update Available",
      message: "Version 2.1 includes new AR features and improved scanning accuracy.",
      timestamp: "2 days ago",
      read: true,
    },
  ])

  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    soundEnabled: true,
    achievements: true,
    challenges: true,
    rewards: true,
    community: true,
    marketing: false,
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reward":
        return <Gift className="h-5 w-5 text-green-600" />
      case "challenge":
        return <Trophy className="h-5 w-5 text-blue-600" />
      case "achievement":
        return <Trophy className="h-5 w-5 text-yellow-600" />
      case "community":
        return <Users className="h-5 w-5 text-purple-600" />
      case "system":
        return <Settings className="h-5 w-5 text-gray-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Notifications</h1>
                {unreadCount > 0 && <p className="text-sm text-gray-600">{unreadCount} unread notifications</p>}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No notifications yet</p>
                  <p className="text-sm text-gray-400">We'll notify you about achievements, challenges, and rewards!</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className={`${!notification.read ? "border-blue-200 bg-blue-50" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <CardTitle className="text-base">{notification.title}</CardTitle>
                          <CardDescription className="mt-1">{notification.message}</CardDescription>
                          <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {notification.actionUrl && (
                    <CardContent className="pt-0">
                      <Link href={notification.actionUrl}>
                        <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you'd like to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* General Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium">General</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-600">Receive notifications on your device</p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, pushNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive weekly summaries via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        <div>
                          <p className="font-medium">Sound</p>
                          <p className="text-sm text-gray-600">Play sound for notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, soundEnabled: checked }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Content Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium">Content Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <div>
                          <p className="font-medium">Achievements & Challenges</p>
                          <p className="text-sm text-gray-600">New achievements and challenge updates</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.achievements}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, achievements: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium">Rewards & Points</p>
                          <p className="text-sm text-gray-600">Available rewards and point milestones</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.rewards}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, rewards: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium">Community Activity</p>
                          <p className="text-sm text-gray-600">New posts and community highlights</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.community}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, community: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium">Eco Tips & News</p>
                          <p className="text-sm text-gray-600">Sustainability tips and environmental news</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.marketing}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, marketing: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quiet Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Quiet Hours</CardTitle>
                <CardDescription>Set times when you don't want to receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Enable Quiet Hours</p>
                    <Switch />
                  </div>
                  <div className="grid grid-cols-2 gap-4 opacity-50">
                    <div>
                      <label className="text-sm font-medium">From</label>
                      <input type="time" className="w-full mt-1 p-2 border rounded-md" defaultValue="22:00" disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium">To</label>
                      <input type="time" className="w-full mt-1 p-2 border rounded-md" defaultValue="08:00" disabled />
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
