"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Recycle,
  MapPin,
  Clock,
  Truck,
  CheckCircle,
  AlertTriangle,
  Leaf,
  ArrowLeft,
  Search,
  Navigation,
} from "lucide-react"
import Link from "next/link"

interface RecyclingCenter {
  id: string
  name: string
  address: string
  distance: string
  hours: string
  accepts: string[]
  phone: string
  rating: number
  specialServices: string[]
}

const mockRecyclingCenters: RecyclingCenter[] = [
  {
    id: "1",
    name: "EcoCenter Downtown",
    address: "123 Green St, Downtown",
    distance: "0.8 miles",
    hours: "Mon-Sat 8AM-6PM",
    accepts: ["Plastic", "Glass", "Metal", "Paper", "Electronics"],
    phone: "(555) 123-4567",
    rating: 4.8,
    specialServices: ["Hazardous Waste", "Battery Collection"],
  },
  {
    id: "2",
    name: "Walmart Recycling Hub",
    address: "456 Commerce Blvd, Midtown",
    distance: "1.2 miles",
    hours: "Daily 7AM-10PM",
    accepts: ["Plastic Bags", "Electronics", "Ink Cartridges"],
    phone: "(555) 234-5678",
    rating: 4.5,
    specialServices: ["Plastic Film Recycling", "Cell Phone Trade-in"],
  },
  {
    id: "3",
    name: "Green Valley Recycling",
    address: "789 Eco Way, Suburbs",
    distance: "2.1 miles",
    hours: "Mon-Fri 9AM-5PM",
    accepts: ["All Materials", "Composting", "Textiles"],
    phone: "(555) 345-6789",
    rating: 4.9,
    specialServices: ["Composting Program", "Textile Recycling"],
  },
]

const recyclingTips = [
  {
    category: "Plastic",
    icon: "♻️",
    tips: [
      "Clean containers before recycling",
      "Remove caps and lids (recycle separately)",
      "Check recycling numbers - 1, 2, and 5 are most commonly accepted",
      "Avoid putting plastic bags in curbside bins",
    ],
  },
  {
    category: "Glass",
    icon: "🍶",
    tips: [
      "Remove caps and lids",
      "No need to remove labels",
      "Separate by color if required locally",
      "Don't include broken glass in regular recycling",
    ],
  },
  {
    category: "Paper",
    icon: "📄",
    tips: [
      "Keep paper dry and clean",
      "Remove plastic windows from envelopes",
      "Staples are okay to leave in",
      "Shred sensitive documents before recycling",
    ],
  },
  {
    category: "Electronics",
    icon: "📱",
    tips: [
      "Wipe personal data before disposal",
      "Remove batteries when possible",
      "Find certified e-waste recyclers",
      "Consider donation if still functional",
    ],
  },
]

export default function RecyclingPage() {
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [searchRadius, setSearchRadius] = useState("5")
  const [showResults, setShowResults] = useState(false)
  const [selectedCenter, setSelectedCenter] = useState<RecyclingCenter | null>(null)

  const handleSearch = () => {
    setShowResults(true)
  }

  const handleGetDirections = (center: RecyclingCenter) => {
    // In a real app, this would open maps with directions
    alert(`Getting directions to ${center.name}...`)
  }

  const handleSchedulePickup = () => {
    alert("Pickup scheduling feature coming soon!")
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Recycling Center</h1>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Find • Learn • Recycle
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-600" />
              Find Recycling Centers
            </CardTitle>
            <CardDescription>Locate nearby recycling facilities and drop-off points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="material">Material Type</Label>
                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Materials</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="glass">Glass</SelectItem>
                    <SelectItem value="paper">Paper</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="batteries">Batteries</SelectItem>
                    <SelectItem value="textiles">Textiles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zipcode">ZIP Code</Label>
                <Input
                  id="zipcode"
                  placeholder="Enter ZIP code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="radius">Search Radius</Label>
                <Select value={searchRadius} onValueChange={setSearchRadius}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 mile</SelectItem>
                    <SelectItem value="5">5 miles</SelectItem>
                    <SelectItem value="10">10 miles</SelectItem>
                    <SelectItem value="25">25 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full bg-green-600 hover:bg-green-700">
              <MapPin className="h-4 w-4 mr-2" />
              Find Centers
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        {showResults && (
          <Card>
            <CardHeader>
              <CardTitle>Nearby Recycling Centers</CardTitle>
              <CardDescription>
                Found {mockRecyclingCenters.length} centers within {searchRadius} miles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecyclingCenters.map((center) => (
                  <div
                    key={center.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedCenter(center)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{center.name}</h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {center.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{center.distance}</Badge>
                        <p className="text-sm text-gray-500 mt-1">★ {center.rating}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {center.hours}
                      </span>
                      <span>{center.phone}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {center.accepts.map((material) => (
                        <Badge key={material} variant="secondary" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                    </div>
                    {center.specialServices.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {center.specialServices.map((service) => (
                          <Badge key={service} variant="outline" className="text-xs bg-green-50 text-green-700">
                            ✓ {service}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleGetDirections(center)
                        }}
                        className="flex-1"
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Directions
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`Calling ${center.phone}...`)
                        }}
                        className="flex-1"
                      >
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pickup Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Schedule Pickup Service
            </CardTitle>
            <CardDescription>Request curbside pickup for large items or bulk recycling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickup-address">Pickup Address</Label>
                <Textarea id="pickup-address" placeholder="Enter your full address" rows={2} />
              </div>
              <div>
                <Label htmlFor="pickup-items">Items for Pickup</Label>
                <Textarea id="pickup-items" placeholder="Describe items (e.g., old TV, appliances)" rows={2} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickup-date">Preferred Date</Label>
                <Input id="pickup-date" type="date" />
              </div>
              <div>
                <Label htmlFor="pickup-time">Preferred Time</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8AM-12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM-5PM)</SelectItem>
                    <SelectItem value="evening">Evening (5PM-8PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Pickup service may include fees for certain items. You'll receive a quote before confirmation.
              </AlertDescription>
            </Alert>
            <Button onClick={handleSchedulePickup} className="w-full bg-blue-600 hover:bg-blue-700">
              <Truck className="h-4 w-4 mr-2" />
              Request Pickup Quote
            </Button>
          </CardContent>
        </Card>

        {/* Recycling Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Recycling Tips & Guidelines
            </CardTitle>
            <CardDescription>Learn how to properly prepare materials for recycling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recyclingTips.map((tip) => (
                <div key={tip.category} className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="text-2xl">{tip.icon}</span>
                    {tip.category}
                  </h3>
                  <ul className="space-y-2">
                    {tip.tips.map((tipText, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {tipText}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Recycle className="h-5 w-5" />
              Your Recycling Impact
            </CardTitle>
            <CardDescription className="text-green-700">
              See how your recycling efforts contribute to environmental protection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">2.3 tons</div>
                <div className="text-sm text-gray-600">CO₂ Saved This Year</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">156 lbs</div>
                <div className="text-sm text-gray-600">Materials Recycled</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600">47</div>
                <div className="text-sm text-gray-600">Trees Saved</div>
              </div>
            </div>
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Great job! Your recycling efforts are making a real difference for the environment.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
