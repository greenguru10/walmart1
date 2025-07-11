"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Camera, Upload, Zap, Loader2, CheckCircle, XCircle, RotateCcw, Hash, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Import our client-side EcoScore engine
import { processProduct, simulateBarcodeDetection, type Product, type Alternative } from "@/lib/ecoscore-engine"

interface ScanResult {
  success: boolean
  product: Product
  alternatives: Alternative[]
  message: string
  barcode: string
}

export default function ScannerPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [manualBarcode, setManualBarcode] = useState("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  const startCamera = useCallback(async () => {
    try {
      setError(null)

      // Stop existing stream
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
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
      console.error("Camera error:", err)
      setError("Camera access denied. Please allow camera permissions or use manual entry.")
    }
  }, [facingMode, cameraStream])

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
      setShowCamera(false)
    }
  }, [cameraStream])

  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
    if (showCamera) {
      stopCamera()
      setTimeout(startCamera, 100)
    }
  }, [showCamera, stopCamera, startCamera])

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
          handleImageScan(file)
        }
      },
      "image/jpeg",
      0.9,
    )
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageScan(file)
    }
  }

  const handleImageScan = async (file: File) => {
    setIsScanning(true)
    setError(null)
    setScanResult(null)
    setProgress(0)
    stopCamera()

    try {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File too large. Please use an image under 5MB.")
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload a valid image file.")
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 8, 85))
      }, 150)

      // Simulate barcode detection
      const detectedBarcode = await simulateBarcodeDetection(file)

      clearInterval(progressInterval)
      setProgress(95)

      if (!detectedBarcode) {
        throw new Error("No barcode detected. Try a clearer image with better lighting.")
      }

      // Process the detected barcode
      const result = processProduct(detectedBarcode)

      if (!result.success) {
        throw new Error(result.error || "Failed to process barcode")
      }

      setProgress(100)
      setScanResult({
        success: true,
        product: result.product!,
        alternatives: result.alternatives!,
        message: result.message,
        barcode: detectedBarcode,
      })

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
    if (!manualBarcode.trim()) {
      setError("Please enter a barcode number")
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
      const result = processProduct(manualBarcode.trim())

      if (!result.success) {
        throw new Error(result.error || "Failed to process barcode")
      }

      setScanResult({
        success: true,
        product: result.product!,
        alternatives: result.alternatives!,
        message: result.message,
        barcode: manualBarcode.trim(),
      })

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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold"> EcoScore Scanner</h1>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            +10 points per scan
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Scanner Interface */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              AI-Powered Scanner🖨️
            </CardTitle>
            <CardDescription>Use your camera, upload an image, or enter a barcode manually</CardDescription>
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

                {/* Camera Controls */}
                <div className="absolute top-4 right-4">
                  <Button
                    onClick={switchCamera}
                    size="sm"
                    variant="secondary"
                    className="bg-black/50 text-white border-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

              {showCamera && (
                <Button onClick={stopCamera} variant="outline" className="w-full bg-transparent" size="lg">
                  Cancel Camera
                </Button>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

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
              <p className="text-xs text-gray-500 mt-1">
                Try: 036000291452 (Head & Shoulders), 123456789 (Organic Shampoo), or any other number
              </p>
            </div>

            {/* Progress Bar */}
            {isScanning && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                  <span className="text-sm font-medium">Processing with AI...</span>
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-gray-500 text-center">
                  Analyzing barcode and calculating sustainability score
                </p>
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
                      src={scanResult.product.image || "/placeholder.svg"}
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
                        {Object.entries(scanResult.product.attributes).map(([key, value]) => (
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
                          src={alt.image || "/placeholder.svg"}
                          alt={alt.name}
                          width={200}
                          height={200}
                          className="w-full rounded border"
                        />

                        {/* Alternative Attributes */}
                        <div className="text-xs text-gray-600 space-y-1">
                          {Object.entries(alt.attributes)
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
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
