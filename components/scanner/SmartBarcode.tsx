"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Camera, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Import barcode detection
import { detectBarcodeFromImage } from "@/lib/barcode-detector"
import { processBarcode, type ScanResult } from "@/lib/ecoscore-engine"

interface SmartBarcodeProps {
  onScanComplete?: (result: ScanResult) => void
  onError?: (error: string) => void
}

export default function SmartBarcode({ onScanComplete, onError }: SmartBarcodeProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraStream(stream)
        setShowCamera(true)
      }
    } catch (err) {
      onError?.("Camera access denied. Please use file upload instead.")
    }
  }, [onError])

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
      setShowCamera(false)
    }
  }, [cameraStream])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
          handleScan(file)
        }
      },
      "image/jpeg",
      0.9,
    )
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleScan(file)
    }
  }

  const handleScan = async (file: File) => {
    setIsScanning(true)
    setProgress(0)
    stopCamera()

    try {
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File too large. Please use an image under 5MB.")
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload a valid image file.")
      }

      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 8, 85))
      }, 150)

      // Detect barcode
      const detectionResult = await detectBarcodeFromImage(file)

      clearInterval(progressInterval)
      setProgress(95)

      if (!detectionResult.barcode) {
        throw new Error("No barcode detected. Try a clearer image with better lighting.")
      }

      // Process barcode
      const result = processBarcode(detectionResult.barcode)

      if (!result.success) {
        throw new Error("Failed to process barcode")
      }

      setProgress(100)
      onScanComplete?.(result)

      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      onError?.(errorMessage)

      // Error haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200])
      }
    } finally {
      setIsScanning(false)
      setTimeout(() => setProgress(0), 1500)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Barcode Scanner</CardTitle>
        <CardDescription>Upload your barcode images for instant sustainability analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera View */}
        {showCamera && (
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg bg-black" />
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Overlay */}
            <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-center">
                <p className="text-white text-sm font-medium mb-2">Position barcode in frame</p>
                <div className="w-48 h-32 border-2 border-white/70 rounded mx-auto"></div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {!showCamera ? (
            <Button onClick={startCamera} disabled={isScanning} className="w-full" size="lg">
              <Camera className="h-5 w-5 mr-2" />
              Open Camera
            </Button>
          ) : (
            <Button onClick={capturePhoto} disabled={isScanning} className="w-full" size="lg">
              <Camera className="h-5 w-5 mr-2" />
              Capture & Scan
            </Button>
          )}

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Image
          </Button>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

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
          </div>
        )}
      </CardContent>
    </Card>
  )
}
