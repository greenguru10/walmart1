// User statistics and progress management
export interface UserStats {
  ecoPoints: number
  carbonSaved: number
  itemsRecycled: number
  itemsScanned: number
  level: number
  streak: number
  totalSpent: number
  sustainableChoices: number
  lastScanDate: string
  achievements: string[]
  scanHistory: ScanHistoryItem[]
}

export interface ScanHistoryItem {
  id: string
  barcode: string
  productName: string
  ecoscore: number
  pointsEarned: number
  timestamp: string
  action: "scanned" | "purchased" | "recycled"
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  pointsReward: number
  requirement: (stats: UserStats) => boolean
  unlocked: boolean
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_scan",
    name: "First Scanner",
    description: "Scanned your first product",
    icon: "🎯",
    pointsReward: 50,
    requirement: (stats) => stats.itemsScanned >= 1,
    unlocked: false,
  },
  {
    id: "eco_warrior",
    name: "Eco Warrior",
    description: "Earned 1000 EcoPoints",
    icon: "⚡",
    pointsReward: 100,
    requirement: (stats) => stats.ecoPoints >= 1000,
    unlocked: false,
  },
  {
    id: "carbon_saver",
    name: "Carbon Saver",
    description: "Saved 5kg of CO₂",
    icon: "🌱",
    pointsReward: 150,
    requirement: (stats) => stats.carbonSaved >= 5,
    unlocked: false,
  },
  {
    id: "recycling_champion",
    name: "Recycling Champion",
    description: "Recycled 10 items",
    icon: "♻️",
    pointsReward: 200,
    requirement: (stats) => stats.itemsRecycled >= 10,
    unlocked: false,
  },
  {
    id: "streak_master",
    name: "Streak Master",
    description: "7-day sustainable shopping streak",
    icon: "🔥",
    pointsReward: 300,
    requirement: (stats) => stats.streak >= 7,
    unlocked: false,
  },
  {
    id: "scanner_pro",
    name: "Scanner Pro",
    description: "Scanned 50 products",
    icon: "📱",
    pointsReward: 250,
    requirement: (stats) => stats.itemsScanned >= 50,
    unlocked: false,
  },
]

export function getDefaultUserStats(): UserStats {
  return {
    ecoPoints: 0,
    carbonSaved: 0,
    itemsRecycled: 0,
    itemsScanned: 0,
    level: 1,
    streak: 0,
    totalSpent: 0,
    sustainableChoices: 0,
    lastScanDate: "",
    achievements: [],
    scanHistory: [],
  }
}

export function loadUserStats(): UserStats {
  if (typeof window === "undefined") return getDefaultUserStats()

  try {
    const saved = localStorage.getItem("ecoStats")
    if (saved) {
      const stats = JSON.parse(saved)
      // Ensure all required fields exist
      return {
        ...getDefaultUserStats(),
        ...stats,
      }
    }
  } catch (error) {
    console.error("Error loading user stats:", error)
  }

  return getDefaultUserStats()
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("ecoStats", JSON.stringify(stats))
  } catch (error) {
    console.error("Error saving user stats:", error)
  }
}

export function updateUserStatsAfterScan(
  currentStats: UserStats,
  product: any,
  action: "scanned" | "purchased" | "recycled" = "scanned",
): UserStats {
  const now = new Date().toISOString()
  const ecoscore = product.ecoscore || 1

  // Calculate points earned
  let pointsEarned = 0
  switch (action) {
    case "scanned":
      pointsEarned = 10 + ecoscore * 2 // Base 10 + bonus for high EcoScore
      break
    case "purchased":
      pointsEarned = Math.floor(ecoscore * 10) // 10-50 points based on EcoScore
      break
    case "recycled":
      pointsEarned = 25 // Fixed points for recycling
      break
  }

  // Calculate carbon saved (rough estimate)
  const carbonSaved = (ecoscore / 5) * 0.5 // 0.1-0.5 kg based on EcoScore

  // Update streak
  const lastScanDate = currentStats.lastScanDate ? new Date(currentStats.lastScanDate) : null
  const today = new Date()
  let newStreak = currentStats.streak

  if (lastScanDate) {
    const daysDiff = Math.floor((today.getTime() - lastScanDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff === 1) {
      newStreak += 1 // Continue streak
    } else if (daysDiff > 1) {
      newStreak = 1 // Reset streak
    }
    // If same day, keep current streak
  } else {
    newStreak = 1 // First scan
  }

  // Create scan history item
  const historyItem: ScanHistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    barcode: product.barcode || "unknown",
    productName: product.name,
    ecoscore,
    pointsEarned,
    timestamp: now,
    action,
  }

  // Update stats
  const newStats: UserStats = {
    ...currentStats,
    ecoPoints: currentStats.ecoPoints + pointsEarned,
    carbonSaved: currentStats.carbonSaved + carbonSaved,
    itemsScanned: action === "scanned" ? currentStats.itemsScanned + 1 : currentStats.itemsScanned,
    itemsRecycled: action === "recycled" ? currentStats.itemsRecycled + 1 : currentStats.itemsRecycled,
    sustainableChoices: ecoscore >= 4 ? currentStats.sustainableChoices + 1 : currentStats.sustainableChoices,
    streak: newStreak,
    lastScanDate: now,
    scanHistory: [historyItem, ...currentStats.scanHistory].slice(0, 100), // Keep last 100 scans
    level: Math.floor((currentStats.ecoPoints + pointsEarned) / 1000) + 1,
  }

  // Check for new achievements
  const newAchievements = checkAchievements(newStats, currentStats.achievements)
  newStats.achievements = newAchievements.unlockedIds
  newStats.ecoPoints += newAchievements.bonusPoints

  return newStats
}

export function checkAchievements(
  stats: UserStats,
  currentAchievements: string[],
): {
  unlockedIds: string[]
  bonusPoints: number
  newAchievements: Achievement[]
} {
  const newlyUnlocked: Achievement[] = []
  let bonusPoints = 0

  for (const achievement of ACHIEVEMENTS) {
    if (!currentAchievements.includes(achievement.id) && achievement.requirement(stats)) {
      newlyUnlocked.push(achievement)
      bonusPoints += achievement.pointsReward
    }
  }

  return {
    unlockedIds: [...currentAchievements, ...newlyUnlocked.map((a) => a.id)],
    bonusPoints,
    newAchievements: newlyUnlocked,
  }
}

export function getAchievementProgress(stats: UserStats): Array<{
  achievement: Achievement
  progress: number
  unlocked: boolean
}> {
  return ACHIEVEMENTS.map((achievement) => {
    const unlocked = stats.achievements.includes(achievement.id)
    let progress = 0

    if (!unlocked) {
      // Calculate progress based on achievement type
      if (achievement.id === "first_scan") {
        progress = Math.min(100, (stats.itemsScanned / 1) * 100)
      } else if (achievement.id === "eco_warrior") {
        progress = Math.min(100, (stats.ecoPoints / 1000) * 100)
      } else if (achievement.id === "carbon_saver") {
        progress = Math.min(100, (stats.carbonSaved / 5) * 100)
      } else if (achievement.id === "recycling_champion") {
        progress = Math.min(100, (stats.itemsRecycled / 10) * 100)
      } else if (achievement.id === "streak_master") {
        progress = Math.min(100, (stats.streak / 7) * 100)
      } else if (achievement.id === "scanner_pro") {
        progress = Math.min(100, (stats.itemsScanned / 50) * 100)
      }
    } else {
      progress = 100
    }

    return {
      achievement,
      progress,
      unlocked,
    }
  })
}

export function getLevelProgress(stats: UserStats): {
  currentLevel: number
  nextLevel: number
  progress: number
  pointsToNext: number
} {
  const currentLevel = stats.level
  const nextLevel = currentLevel + 1
  const pointsInCurrentLevel = stats.ecoPoints % 1000
  const pointsToNext = 1000 - pointsInCurrentLevel
  const progress = (pointsInCurrentLevel / 1000) * 100

  return {
    currentLevel,
    nextLevel,
    progress,
    pointsToNext,
  }
}
