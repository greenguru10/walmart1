"use client"

import { useState, useEffect } from "react"
import {
  Camera,
  Upload,
  Zap,
  Loader2,
  CheckCircle,
  XCircle,
  RotateCcw,
  Hash,
  Info,
  ArrowLeft,
  ShoppingCart,
  Share2,
  Bookmark,
  Trophy,
  Star,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

// Import our enhanced barcode detection and EcoScore engine
import { detectBarcodeFromImage, validateBarcode } from "@/lib/barcode-detector"
import { processBarcode, type ScanResult } from "@/lib/ecoscore-engine"
import { loadUserStats, saveUserStats, updateUserStatsAfterScan, type UserStats } from "@/lib/user-stats"

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [manualBarcode, setManualBarcode] = useState("")
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [showAchievement, setShowAchievement] = useState<string | null>(null)

  // Load user stats on component mount
  useEffect(() => {
    const stats = loadUserStats()
    setUserStats(stats)
  }, [])

  const handleImageScan = async (file: File) => {
    setIsScanning(true)
    setError(null)
    setScanResult(null)
    setProgress(0)

    try {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File too large. Please use an image under 5MB.")
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload a valid image file.")
      }

      // Simulate progress during barcode detection
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 8, 85))
      }, 150)

      // Detect barcode from image
      const detectionResult = await detectBarcodeFromImage(file)

      clearInterval(progressInterval)
      setProgress(95)

      if (!detectionResult.barcode) {
        throw new Error("No barcode detected. Try a clearer image with better lighting, or use manual entry.")
      }

      // Process the detected barcode
      const result = processBarcode(detectionResult.barcode)

      if (!result.success) {
        throw new Error("Failed to process barcode")
      }

      setProgress(100)
      setScanResult(result)

      // Update user stats
      if (userStats) {
        const newStats = updateUserStatsAfterScan(userStats, result.product, "scanned")
        const earnedPoints = newStats.ecoPoints - userStats.ecoPoints

        setUserStats(newStats)
        saveUserStats(newStats)

        // Show points animation
        setPointsEarned(earnedPoints)
        setShowPointsAnimation(true)
        setTimeout(() => setShowPointsAnimation(false), 3000)

        // Check for new achievements
        if (newStats.achievements.length > userStats.achievements.length) {
          const newAchievement = newStats.achievements[newStats.achievements.length - 1]
          setShowAchievement(newAchievement)
          setTimeout(() => setShowAchievement(null), 5000)
        }
      }

      // Haptic feedback on success
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    } catch (err) {
      console.error("Scan error:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)

      // Haptic feedback on error
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200])
      }
    } finally {
      setIsScanning(false)
      setTimeout(() => setProgress(0), 1500)
    }
  }

  const handleManualScan = async () => {
    const cleanBarcode = manualBarcode.trim()

    if (!cleanBarcode) {
      setError("Please enter a barcode number")
      return
    }

    // Validate barcode format
    if (!validateBarcode(cleanBarcode)) {
      setError("Invalid barcode format. Please enter a valid 12 or 13 digit barcode.")
      return
    }

    setIsScanning(true)
    setError(null)
    setScanResult(null)
    setProgress(0)

    try {
      // Simulate processing time
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      clearInterval(progressInterval)
      setProgress(100)

      // Process the manual barcode
      const result = processBarcode(cleanBarcode)

      if (!result.success) {
        throw new Error("Failed to process barcode")
      }

      setScanResult(result)

      // Update user stats
      if (userStats) {
        const newStats = updateUserStatsAfterScan(userStats, result.product, "scanned")
        const earnedPoints = newStats.ecoPoints - userStats.ecoPoints

        setUserStats(newStats)
        saveUserStats(newStats)

        // Show points animation
        setPointsEarned(earnedPoints)
        setShowPointsAnimation(true)
        setTimeout(() => setShowPointsAnimation(false), 3000)

        // Check for new achievements
        if (newStats.achievements.length > userStats.achievements.length) {
          const newAchievement = newStats.achievements[newStats.achievements.length - 1]
          setShowAchievement(newAchievement)
          setTimeout(() => setShowAchievement(null), 5000)
        }
      }

      // Haptic feedback on success
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    } catch (err) {
      console.error("Manual scan error:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)

      // Haptic feedback on error
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200])
      }
    } finally {
      setIsScanning(false)
      setTimeout(() => setProgress(0), 1500)
    }
  }

  const handleAddToCart = (product: any, isAlternative = false) => {
    if (!userStats) return

    const newStats = updateUserStatsAfterScan(userStats, product, "purchased")
    const earnedPoints = newStats.ecoPoints - userStats.ecoPoints

    setUserStats(newStats)
    saveUserStats(newStats)

    // Show success message
    alert(
      `Added to cart! You earned ${earnedPoints} EcoPoints for this ${product.ecoscore >= 4 ? "excellent" : "sustainable"} choice! 🌱`,
    )

    // Show points animation
    setPointsEarned(earnedPoints)
    setShowPointsAnimation(true)
    setTimeout(() => setShowPointsAnimation(false), 3000)
  }

  const shareProduct = () => {
    if (scanResult) {
      const shareText = `Check out this ${scanResult.product.name} with an EcoScore of ${scanResult.product.ecoscore}/5! 🌱 #SustainableShopping #EcoWalmart`

      if (navigator.share) {
        navigator.share({
          title: `${scanResult.product.name} - EcoScore`,
          text: shareText,
          url: window.location.href,
        })
      } else {
        navigator.clipboard.writeText(shareText)
        alert("Product info copied to clipboard!")
      }
    }
  }

  const resetScan = () => {
    setScanResult(null)
    setError(null)
    setProgress(0)
    setManualBarcode("")
  }

  const getEcoScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 3) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getEcoScoreLabel = (score: number) => {
    if (score >= 4) return "Excellent"
    if (score >= 3) return "Good"
    if (score >= 2) return "Fair"
    return "Poor"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-20">
      {/* Points Animation */}
      {showPointsAnimation && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            <span className="font-bold">+{pointsEarned} EcoPoints!</span>
          </div>
        </div>
      )}

      {/* Achievement Notification */}
      {showAchievement && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 z-50 animate-pulse">
          <div className="bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            <span className="font-bold">Achievement Unlocked!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">AI EcoScore Scanner</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {userStats?.ecoPoints || 0} Points
            </Badge>
            <Badge variant="outline">Level {userStats?.level || 1}</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* User Stats Summary */}
        {userStats && (
          <Card className="bg-gradient-to-r from-green-100 to-blue-100">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{userStats.itemsScanned}</div>
                  <div className="text-xs text-gray-600">Items Scanned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{userStats.carbonSaved.toFixed(1)}kg</div>
                  <div className="text-xs text-gray-600">CO₂ Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{userStats.streak}</div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scanner Interface */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              AI-Powered Barcode Scanner
            </CardTitle>
            <CardDescription>
              Upload your barcode images or enter barcode numbers manually for instant sustainability analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={() => document.getElementById("file-input")?.click()}
                disabled={isScanning}
                className="w-full"
                size="lg"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Barcode Image
              </Button>
              <Button
                onClick={() => document.getElementById("camera-input")?.click()}
                disabled={isScanning}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Camera className="h-5 w-5 mr-2" />
                Take Photo
              </Button>
            </div>

            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageScan(file)
              }}
              className="hidden"
            />

            <input
              id="camera-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageScan(file)
              }}
              className="hidden"
            />

            {/* Manual Barcode Entry */}
            <div className="border-t pt-4">
              <Label htmlFor="manual-barcode" className="text-sm font-medium flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4" />
                Manual Barcode Entry
              </Label>
              <div className="flex gap-2">
                <Input
                  id="manual-barcode"
                  placeholder="Enter barcode (e.g., 036000291452)"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  disabled={isScanning}
                  className="flex-1"
                />
                <Button onClick={handleManualScan} disabled={isScanning || !manualBarcode.trim()}>
                  {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Scan"}
                </Button>
              </div>
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <p>
                  <strong>Try these real barcodes:</strong>
                </p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span>• 036000291452 (Head & Shoulders)</span>
                  <span>• 841351162524 (Gillette Razor)</span>
                  <span>• 073149042441 (Bounty Towels)</span>
                  <span>• 041785005007 (Scotch-Brite Sponge)</span>
                  <span>• 885909950805 (Conair Brush)</span>
                  <span>• 123456789 (Organic Shampoo)</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {isScanning && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                  <span className="text-sm font-medium">
                    {progress < 50
                      ? "Detecting barcode..."
                      : progress < 90
                        ? "Analyzing product..."
                        : "Calculating EcoScore..."}
                  </span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-gray-500 text-center">AI-powered sustainability analysis in progress</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button onClick={resetScan} variant="outline" size="sm">
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Scan Results */}
        {scanResult && (
          <div className="space-y-6">
            {/* Success Message */}
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 flex items-center justify-between">
                {scanResult.message}
                <Button onClick={resetScan} variant="outline" size="sm">
                  Scan Another
                </Button>
              </AlertDescription>
            </Alert>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{scanResult.product.name}</CardTitle>
                    <CardDescription className="mt-1">{scanResult.product.description}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{scanResult.product.category}</Badge>
                      <Badge variant="outline">Barcode: {scanResult.barcode}</Badge>
                    </div>
                  </div>
                  <Badge className={`text-lg px-3 py-1 ${getEcoScoreColor(scanResult.product.ecoscore!)}`}>
                    {scanResult.product.ecoscore}/5 {getEcoScoreLabel(scanResult.product.ecoscore!)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div className="space-y-4">
                    <Image
                      src={scanResult.product.image || "/placeholder.svg?height=300&width=300"}
                      alt={scanResult.product.name}
                      width={300}
                      height={300}
                      className="w-full rounded-lg border"
                    />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Price:</span>
                        <p className="text-green-600 font-bold text-lg">{scanResult.product.price}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Category:</span>
                        <p className="font-medium">{scanResult.product.category}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Packaging:</span>
                        <p className="font-medium">{scanResult.product.packaging}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Carbon Impact:</span>
                        <p
                          className={`font-medium ${scanResult.product.carbonFootprint === "Low" ? "text-green-600" : "text-red-600"}`}
                        >
                          {scanResult.product.carbonFootprint}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sustainability Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-700">
                        <Info className="h-4 w-4" />
                        Sustainability Insights
                      </h3>
                      <ul className="space-y-2">
                        {scanResult.product.sustainabilityTips?.map((tip, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-700 flex items-start gap-2 p-2 bg-green-50 rounded"
                          >
                            <span className="text-green-500 mt-0.5 font-bold">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Product Attributes */}
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-700">Product Details</h3>
                      <div className="space-y-2 text-sm">
                        {Object.entries(scanResult.product.attributes)
                          .filter(([key, value]) => value !== undefined && value !== null && value !== "")
                          .slice(0, 8)
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                              <span className="capitalize text-gray-600 font-medium">
                                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                              </span>
                              <span className="font-medium text-right max-w-[60%]">
                                {Array.isArray(value) ? value.join(", ") : String(value)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Button onClick={() => handleAddToCart(scanResult.product)} className="bg-blue-600 hover:bg-blue-700">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart (+{Math.floor((scanResult.product.ecoscore || 1) * 10)} pts)
                  </Button>
                  <Button variant="outline" onClick={shareProduct}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Product
                  </Button>
                  <Button variant="outline">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save for Later
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Alternatives */}
            {scanResult.alternatives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="text-green-600">🌱</span>
                    Eco-Friendly Alternatives
                  </CardTitle>
                  <CardDescription>
                    Better options for the environment - make a positive impact with your next purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {scanResult.alternatives.map((alt) => (
                      <div key={alt.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-gray-900">{alt.name}</h4>
                          <Badge className={`${getEcoScoreColor(alt.ecoscore)}`}>{alt.ecoscore}/5</Badge>
                        </div>
                        <p className="text-sm text-green-700 bg-green-50 p-2 rounded font-medium">
                          💡 {alt.improvement}
                        </p>
                        <p className="text-green-600 font-bold text-lg">{alt.price}</p>
                        <Image
                          src={alt.image || "/placeholder.svg?height=200&width=200"}
                          alt={alt.name}
                          width={200}
                          height={200}
                          className="w-full rounded border"
                        />

                        {/* Alternative Attributes */}
                        <div className="text-xs text-gray-600 space-y-1">
                          {Object.entries(alt.attributes)
                            .filter(([key, value]) => value !== undefined && value !== null && value !== "")
                            .slice(0, 3)
                            .map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                                <span className="font-medium">
                                  {Array.isArray(value) ? value.join(", ") : String(value)}
                                </span>
                              </div>
                            ))}
                        </div>

                        <Button
                          onClick={() => handleAddToCart(alt, true)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Choose This Alternative (+{alt.ecoscore * 10} pts)
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full bg-transparent">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="w-full bg-transparent">
                  <Trophy className="mr-2 h-4 w-4" />
                  Achievements
                </Button>
              </Link>
              <Link href="/recycling">
                <Button variant="outline" className="w-full bg-transparent">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Recycling
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" className="w-full bg-transparent">
                  <Share2 className="mr-2 h-4 w-4" />
                  Community
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
