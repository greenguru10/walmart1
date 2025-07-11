"use client"

import { Leaf, ShoppingCart } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "full" | "icon"
  className?: string
}

export function Logo({ size = "md", variant = "full", className }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  if (variant === "icon") {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg"></div>
        <div className="relative flex items-center justify-center h-full">
          <Leaf className="h-1/2 w-1/2 text-white" />
          <ShoppingCart className="h-1/3 w-1/3 text-white absolute bottom-0 right-0" />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg shadow-lg"></div>
        <div className="relative flex items-center justify-center h-full">
          <Leaf className="h-1/2 w-1/2 text-white" />
          <ShoppingCart className="h-1/3 w-1/3 text-white absolute bottom-0 right-0" />
        </div>
      </div>
      <div className="flex flex-col">
        <span
          className={`font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent ${textSizes[size]}`}
        >
          EcoMart
        </span>
        {size !== "sm" && <span className="text-xs text-gray-500 -mt-1">Sustainable Shopping</span>}
      </div>
    </div>
  )
}
