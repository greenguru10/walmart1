"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Search, HelpCircle, MessageCircle, Mail, Phone } from "lucide-react"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

export function FAQSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openItems, setOpenItems] = useState<string[]>([])

  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "How does the EcoScore calculation work?",
      answer:
        "EcoScore is calculated based on multiple factors including carbon footprint, packaging sustainability, recyclability, organic certification, and local sourcing. Each product gets a base score that's adjusted based on these environmental factors, resulting in a score from 0-100.",
      category: "scoring",
      helpful: 156,
    },
    {
      id: "2",
      question: "How do I earn EcoPoints?",
      answer:
        "You can earn EcoPoints by: scanning products (+10 points), making sustainable purchases (points based on EcoScore), recycling items (+5-50 points depending on item), completing challenges (50-1000 points), and sharing eco-tips in the community (+25 points).",
      category: "points",
      helpful: 203,
    },
    {
      id: "3",
      question: "Are the rewards real money?",
      answer:
        "Yes! Our rewards include real Walmart gift cards, cashback to your account, and discounts on future purchases. We also offer donation options to environmental organizations and eco-friendly products.",
      category: "rewards",
      helpful: 189,
    },
    {
      id: "4",
      question: "How accurate is the barcode scanner?",
      answer:
        "Our scanner uses advanced computer vision and works with 99.5% of UPC-12 barcodes found in Walmart stores. It's optimized for grocery products, household items, and personal care products. If scanning fails, you can always enter the barcode manually.",
      category: "scanning",
      helpful: 142,
    },
    {
      id: "5",
      question: "Can I use this app in any Walmart store?",
      answer:
        "Yes! The app works in all Walmart locations across the US. Product data is sourced from Walmart's database and verified environmental databases to ensure accuracy regardless of location.",
      category: "general",
      helpful: 167,
    },
    {
      id: "6",
      question: "How do I verify my recycling activities?",
      answer:
        "Simply take a photo of your recycled items before disposing of them. Our AI system verifies the items and awards points automatically. Make sure items are clean and clearly visible in the photo for best results.",
      category: "recycling",
      helpful: 134,
    },
    {
      id: "7",
      question: "What happens to my personal data?",
      answer:
        "We take privacy seriously. Your shopping data is anonymized and used only to improve EcoScore accuracy and provide personalized recommendations. We never sell personal information and you can delete your account anytime.",
      category: "privacy",
      helpful: 178,
    },
    {
      id: "8",
      question: "How often are EcoScores updated?",
      answer:
        "EcoScores are updated monthly as we receive new environmental data from manufacturers and certification bodies. Major changes (like new certifications) are updated immediately.",
      category: "scoring",
      helpful: 98,
    },
    {
      id: "9",
      question: "Can I suggest new features?",
      answer:
        "We love hearing from our community. Use the feedback option in settings or join our community forum to suggest features and vote on ideas from other users.",
      category: "general",
      helpful: 145,
    },
    {
      id: "10",
      question: "Why can't I find some products?",
      answer:
        "We're constantly expanding our database. If a product isn't found, you can submit it for review and we'll add it within 48 hours. Local and specialty items may take longer to include.",
      category: "scanning",
      helpful: 112,
    },
  ]

  const categories = [
    { id: "all", name: "All Topics", count: faqs.length },
    { id: "scoring", name: "EcoScore", count: faqs.filter((f) => f.category === "scoring").length },
    {
      id: "points",
      name: "Points & Rewards",
      count: faqs.filter((f) => f.category === "points").length + faqs.filter((f) => f.category === "rewards").length,
    },
    { id: "scanning", name: "Scanning", count: faqs.filter((f) => f.category === "scanning").length },
    { id: "recycling", name: "Recycling", count: faqs.filter((f) => f.category === "recycling").length },
    { id: "general", name: "General", count: faqs.filter((f) => f.category === "general").length },
  ]

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" ||
      faq.category === selectedCategory ||
      (selectedCategory === "points" && (faq.category === "points" || faq.category === "rewards"))
    return matchesSearch && matchesCategory
  })

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
            <p className="text-gray-600">Find answers to common questions about EcoMart</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for help topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="text-xs"
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-8">
          {filteredFAQs.map((faq) => (
            <Card key={faq.id}>
              <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${openItems.includes(faq.id) ? "rotate-180" : ""}`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 mb-4">{faq.answer}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {faq.helpful} people found this helpful
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          👍 Helpful
                        </Button>
                        <Button variant="outline" size="sm">
                          👎 Not helpful
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Still Need Help?
            </CardTitle>
            <CardDescription>Can't find what you're looking for? Our support team is here to help!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Live Chat</div>
                  <div className="text-xs text-gray-500">Available 24/7</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Mail className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Email Support</div>
                  <div className="text-xs text-gray-500">Response within 24h</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Phone className="h-6 w-6 text-purple-600" />
                <div className="text-center">
                  <div className="font-medium">Phone Support</div>
                  <div className="text-xs text-gray-500">Mon-Fri 9AM-6PM</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
