"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Recycle, Package } from "lucide-react"

interface EcoScore {
  base: number
  adjustments: {
    isOrganic: number
    hasPlastic: number
    isLocal: number
  }
  final: number
}

interface EcoScoreDialProps {
  score: EcoScore
  productName: string
  className?: string
  animated?: boolean
}

export function EcoScoreDial({ score, productName, className, animated = true }: EcoScoreDialProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (animated) {
      setIsAnimating(true)
      const duration = 1500
      const steps = 60
      const increment = score.final / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= score.final) {
          setDisplayScore(score.final)
          setIsAnimating(false)
          clearInterval(timer)
        } else {
          setDisplayScore(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    } else {
      setDisplayScore(score.final)
    }
  }, [score.final, animated])

  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return { color: "#22c55e", label: "Excellent", bg: "bg-green-50" }
    if (scoreValue >= 60) return { color: "#eab308", label: "Good", bg: "bg-yellow-50" }
    if (scoreValue >= 40) return { color: "#f97316", label: "Fair", bg: "bg-orange-50" }
    return { color: "#ef4444", label: "Poor", bg: "bg-red-50" }
  }

  const scoreInfo = getScoreColor(displayScore)
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (displayScore / 100) * circumference

  return (
    <Card className={`${className} ${scoreInfo.bg} border-2`} style={{ borderColor: scoreInfo.color }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-center">{productName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Dial */}
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none" />

            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={scoreInfo.color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={isAnimating ? "transition-all duration-1500 ease-out" : ""}
            />

            {/* Glow Effect */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={scoreInfo.color}
              strokeWidth="2"
              fill="none"
              opacity="0.3"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={isAnimating ? "transition-all duration-1500 ease-out" : ""}
            />
          </svg>

          {/* Score Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold transition-colors duration-300" style={{ color: scoreInfo.color }}>
              {displayScore}
            </div>
            <div className="text-xs text-gray-600">EcoScore</div>
          </div>
        </div>

        {/* Score Label */}
        <div className="text-center">
          <Badge className="text-white border-0 px-4 py-1" style={{ backgroundColor: scoreInfo.color }}>
            {scoreInfo.label}
          </Badge>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Score Breakdown:</div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Base Score</span>
              <span className="font-medium">{score.base}</span>
            </div>

            {score.adjustments.isOrganic > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span className="flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  Organic
                </span>
                <span className="font-medium">+{score.adjustments.isOrganic}</span>
              </div>
            )}

            {score.adjustments.hasPlastic < 0 && (
              <div className="flex justify-between items-center text-red-600">
                <span className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  Plastic Packaging
                </span>
                <span className="font-medium">{score.adjustments.hasPlastic}</span>
              </div>
            )}

            {score.adjustments.isLocal > 0 && (
              <div className="flex justify-between items-center text-blue-600">
                <span className="flex items-center gap-1">
                  <Recycle className="h-3 w-3" />
                  Local Source
                </span>
                <span className="font-medium">+{score.adjustments.isLocal}</span>
              </div>
            )}

            <div className="border-t pt-1 flex justify-between items-center font-medium">
              <span>Final Score</span>
              <span style={{ color: scoreInfo.color }}>{score.final}</span>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-white/50 rounded-lg p-3 space-y-2">
          <div className="text-xs font-medium text-gray-700">Environmental Impact</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-green-600">{(score.final * 0.01).toFixed(2)} kg</div>
              <div className="text-gray-600">CO₂ Saved</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">{Math.floor(score.final * 0.5)}%</div>
              <div className="text-gray-600">Recyclable</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
