// Complete EcoScore calculation engine with your Flask backend logic converted to TypeScript

export interface Product {
  itemId: string
  name: string
  category: string
  price: string
  description: string
  image: string
  ecoscore?: number
  packaging: string
  carbonFootprint: string
  sustainabilityTips?: string[]
  attributes: Record<string, any>
}

export interface Alternative {
  id: string
  name: string
  ecoscore: number
  price: string
  improvement: string
  image: string
  attributes: Record<string, any>
}

export interface ScanResult {
  success: boolean
  product: Product
  alternatives: Alternative[]
  barcode: string
  message: string
  confidence?: number
}

// Enhanced product database with your original Flask data
const MOCK_PRODUCTS: { [key: string]: Product } = {
  // Real barcodes from your images
  "036000291452": {
    itemId: "12417832",
    name: "Head & Shoulders Classic Clean Shampoo",
    category: "Beauty",
    price: "$4.97",
    description: "Anti-dandruff shampoo with zinc pyrithione",
    image: "/placeholder.svg?height=300&width=300",
    packaging: "Plastic bottle",
    carbonFootprint: "Medium",
    attributes: {
      brand: "Head & Shoulders",
      material: "Synthetic formula",
      packaging: "HDPE plastic bottle",
      ingredients: "Zinc pyrithione, sulfates",
      size: "13.5 fl oz",
      biodegradable: false,
      recyclable: true,
      dermatologistTested: true,
    },
  },
  "841351162524": {
    itemId: "23568914",
    name: "Gillette Fusion5 Men's Razor",
    category: "Personal Care",
    price: "$12.97",
    description: "5-blade razor with precision trimmer",
    image: "/placeholder.svg?height=300&width=300",
    packaging: "Plastic packaging",
    carbonFootprint: "High",
    attributes: {
      brand: "Gillette",
      material: "Plastic handle, steel blades",
      packaging: "Plastic blister pack",
      bladeCount: 5,
      biodegradable: false,
      recyclable: false,
      lifespan: "1-2 months",
    },
  },
  "073149042441": {
    itemId: "34679025",
    name: "Bounty Select-A-Size Paper Towels",
    category: "Home",
    price: "$6.98",
    description: "2-ply absorbent paper towels",
    image: "/placeholder.svg?height=300&width=300",
    packaging: "Plastic wrap",
    carbonFootprint: "Medium",
    attributes: {
      brand: "Bounty",
      material: "Virgin paper pulp",
      packaging: "Plastic wrap",
      sheets: 74,
      biodegradable: true,
      recyclable: false,
      postConsumerWaste: "0%",
    },
  },
  "041785005007": {
    itemId: "45780136",
    name: "Scotch-Brite Heavy Duty Scrub Sponge",
    category: "Home",
    price: "$3.47",
    description: "Durable scrubbing sponge for tough cleaning",
    image: "/placeholder.svg?height=300&width=300",
    packaging: "Plastic packaging",
    carbonFootprint: "High",
    attributes: {
      brand: "Scotch-Brite",
      material: "Synthetic fibers and foam",
      packaging: "Plastic wrap",
      biodegradable: false,
      recyclable: false,
      durability: "Medium",
      antimicrobial: false,
    },
  },
  "885909950805": {
    itemId: "56891247",
    name: "Conair Cushion Brush with Ball-Tipped Bristles",
    category: "Beauty",
    price: "$8.97",
    description: "Gentle cushion brush for all hair types",
    image: "/placeholder.svg?height=300&width=300",
    packaging: "Cardboard packaging",
    carbonFootprint: "Medium",
    attributes: {
      brand: "Conair",
      material: "Plastic handle, nylon bristles",
      packaging: "Cardboard with plastic window",
      biodegradable: false,
      recyclable: true,
      lifespan: "2-3 years",
      bristleType: "Ball-tipped nylon",
    },
  },

  // Additional products from your original Flask backend
  "123456789": {
    itemId: "12417832",
    name: "Organic Lavender Shampoo",
    category: "Beauty",
    price: "$9.99",
    description: "Natural organic shampoo with lavender essential oil",
    image: "/placeholder.svg?height=300&width=300",
    packaging: "Recycled plastic bottle",
    carbonFootprint: "Low",
    attributes: {
      brand: "EcoClean",
      material: "Organic ingredients",
      packaging: "Recycled plastic",
      ingredients: "Plant-based, SLS-free",
      certifications: ["USDA Organic", "Leaping Bunny"],
      biodegradable: true,
      recyclable: true,
    },
  },
  "234567890": {
    itemId: "23568914",
    name: "Bamboo Hairbrush",
    category: "Beauty",
    price: "$12.99",
    description: "Sustainable bamboo hairbrush with natural bristles",
    image: "/placeholder.svg?height=300&width=300",
    packaging: "Cardboard box",
    carbonFootprint: "Low",
    attributes: {
      brand: "GreenTools",
      material: "Bamboo",
      packaging: "Cardboard",
      biodegradable: true,
      recyclable: true,
      durability: "High",
      bristleType: "Natural boar bristles",
    },
  },
  "345678901": {
    itemId: "34679025",
    name: "Recycled Paper Towels",
    category: "Home",
    price: "$4.99",
    description: "100% recycled paper towels",
    image: "/placeholder.svg?height=300&width=300",
    packaging: "Paper wrapper",
    carbonFootprint: "Low",
    attributes: {
      brand: "EcoHome",
      material: "Recycled paper",
      packaging: "Paper",
      biodegradable: true,
      recyclable: true,
      postConsumerWaste: "80%",
    },
  },
  "456789012": {
    itemId: "45780136",
    name: "Metal Safety Razor",
    category: "Personal Care",
    price: "$19.99",
    description: "Durable stainless steel safety razor",
    image: "/placeholder.svg?height=300&width=300",
    packaging: "Metal tin",
    carbonFootprint: "Low",
    attributes: {
      brand: "ZeroWaste",
      material: "Stainless steel",
      packaging: "Metal tin",
      biodegradable: false,
      recyclable: true,
      lifespan: "Lifetime",
    },
  },
}

export function generateEcoScore(product: Product): number {
  let score = 0

  // Material scoring (50% of total)
  const materialScores: { [key: string]: number } = {
    Bamboo: 5,
    Glass: 4,
    "Stainless steel": 4,
    "Organic ingredients": 4,
    "Plant-based": 4,
    "Recycled paper": 4,
    "Recycled plastic": 3,
    "HDPE plastic bottle": 2,
    "Plastic handle, steel blades": 2,
    "Virgin paper pulp": 2,
    "Synthetic formula": 1,
    "Synthetic fibers and foam": 1,
  }

  const material = product.attributes.material || "Plastic"
  score += (materialScores[material] || 1) * 0.5

  // Packaging scoring (20% of total)
  const packagingScores: { [key: string]: number } = {
    None: 5,
    "Compostable bag": 5,
    Cardboard: 5,
    Paper: 5,
    "Paper wrapper": 5,
    "Glass jar": 4,
    "Recycled cardboard": 4,
    "Metal tin": 4,
    "Cardboard with plastic window": 3,
    "Recycled HDPE plastic": 3,
    "HDPE plastic bottle": 2,
    "Plastic bottle": 2,
    "Plastic packaging": 1,
    "Plastic wrap": 1,
    "Plastic blister pack": 1,
  }

  const packaging = product.attributes.packaging || "Plastic wrap"
  score += (packagingScores[packaging] || 1) * 0.2

  // Additional attributes (30% of total)
  if (product.attributes.biodegradable) score += 1.5
  if (product.attributes.recyclable) score += 1.0
  if (product.attributes.certifications?.length) {
    score += product.attributes.certifications.length * 0.5
  }
  if (product.attributes.carbonNeutral) score += 1.0
  if (product.attributes.local) score += 0.5
  if (product.attributes.fairTrade) score += 0.5
  if (product.attributes.lifespan === "Lifetime") score += 1.0
  if (product.attributes.postConsumerWaste && Number.parseInt(product.attributes.postConsumerWaste) > 50) score += 0.5

  // Normalize to 1-5 scale
  return Math.min(5, Math.max(1, Math.round(score)))
}

export function getAlternatives(product: Product): Alternative[] {
  const category = product.category
  const productName = product.name.toLowerCase()

  // Beauty alternatives
  if (category === "Beauty") {
    if (productName.includes("shampoo")) {
      return [
        {
          id: "alt-shampoo-1",
          name: "Shampoo Bar (Package Free)",
          ecoscore: 5,
          price: "$7.99",
          improvement: "Eliminates plastic bottle entirely",
          image: "/placeholder.svg?height=200&width=200",
          attributes: {
            material: "Solid formulation",
            packaging: "None",
            wasteReduction: "100% packaging-free",
            biodegradable: true,
            certifications: ["Vegan", "Cruelty-Free"],
          },
        },
        {
          id: "alt-shampoo-2",
          name: "Refillable Shampoo System",
          ecoscore: 4,
          price: "$12.99",
          improvement: "Reduces packaging waste by 80%",
          image: "/placeholder.svg?height=200&width=200",
          attributes: {
            material: "Liquid concentrate",
            packaging: "Aluminum bottle",
            refillCount: "10+ uses",
            recyclable: true,
          },
        },
      ]
    } else if (productName.includes("brush")) {
      return [
        {
          id: "alt-brush-1",
          name: "100% Biodegradable Hairbrush",
          ecoscore: 5,
          price: "$14.99",
          improvement: "Fully compostable including bristles",
          image: "/placeholder.svg?height=200&width=200",
          attributes: {
            material: "Wood and natural bristles",
            packaging: "None",
            biodegradable: true,
            compostTime: "6-12 months",
          },
        },
      ]
    }
  }

  // Personal Care alternatives
  else if (category === "Personal Care") {
    if (productName.includes("razor")) {
      return [
        {
          id: "alt-razor-1",
          name: "Compostable Bamboo Razor",
          ecoscore: 5,
          price: "$9.99",
          improvement: "Fully biodegradable alternative",
          image: "/placeholder.svg?height=200&width=200",
          attributes: {
            material: "Bamboo with steel blade",
            packaging: "Compostable cellulose",
            biodegradable: true,
            bladeReplacements: "Yes",
          },
        },
        {
          id: "alt-razor-2",
          name: "Stainless Steel Safety Razor",
          ecoscore: 4,
          price: "$19.99",
          improvement: "Lifetime durability, replaceable blades",
          image: "/placeholder.svg?height=200&width=200",
          attributes: {
            material: "Stainless steel",
            packaging: "Metal tin",
            lifespan: "Lifetime",
            recyclable: true,
          },
        },
      ]
    }
  }

  // Home alternatives
  else if (category === "Home") {
    if (productName.includes("sponge")) {
      return [
        {
          id: "alt-sponge-1",
          name: "Plant-Based Loofah Sponge",
          ecoscore: 5,
          price: "$4.49",
          improvement: "100% natural and compostable",
          image: "/placeholder.svg?height=200&width=200",
          attributes: {
            material: "Loofah plant",
            packaging: "None",
            compostTime: "3-6 months",
            biodegradable: true,
          },
        },
        {
          id: "alt-sponge-2",
          name: "Reusable Silicone Sponge",
          ecoscore: 4,
          price: "$6.99",
          improvement: "Lasts years instead of weeks",
          image: "/placeholder.svg?height=200&width=200",
          attributes: {
            material: "Food-grade silicone",
            packaging: "Recycled paper",
            lifespan: "2+ years",
            recyclable: true,
          },
        },
      ]
    } else if (productName.includes("towel")) {
      return [
        {
          id: "alt-towel-1",
          name: "Reusable Cloth Towels",
          ecoscore: 5,
          price: "$12.99",
          improvement: "Washable and reusable hundreds of times",
          image: "/placeholder.svg?height=200&width=200",
          attributes: {
            material: "Organic cotton",
            packaging: "None",
            washable: true,
            lifespan: "2+ years",
          },
        },
      ]
    }
  }

  // Default alternatives
  return [
    {
      id: "alt-default-1",
      name: "Eco-Friendly Alternative",
      ecoscore: 4,
      price: "$8.99",
      improvement: "Better environmental profile",
      image: "/placeholder.svg?height=200&width=200",
      attributes: {
        material: "Sustainable alternative",
        packaging: "Eco-friendly",
        impact: "Reduced carbon footprint",
      },
    },
  ]
}

export function getSustainabilityTips(product: Product): string[] {
  const tips: string[] = []
  const attributes = product.attributes

  if (attributes.material?.includes("Plastic") || attributes.material?.includes("Synthetic")) {
    tips.push("Consider alternatives with less plastic content to reduce microplastic pollution")
  }

  if (!attributes.recyclable) {
    tips.push("This item cannot be recycled - please dispose properly to avoid contamination")
  }

  if (attributes.biodegradable) {
    tips.push("This product is biodegradable - compost if possible to complete the lifecycle")
  }

  const ecoscore = generateEcoScore(product)
  if (ecoscore < 3) {
    tips.push("We found better alternatives with higher EcoScores - check the suggestions")
  } else if (ecoscore >= 4) {
    tips.push("Great choice! This product has excellent sustainability credentials")
  }

  if (attributes.packaging?.toLowerCase().includes("plastic")) {
    tips.push("Look for brands that offer take-back programs for their packaging")
  }

  if (attributes.lifespan === "Lifetime") {
    tips.push("This durable product will last for years, reducing replacement waste")
  }

  if (!tips.length) {
    tips.push("Small changes make a big difference - consider reusable options next time")
  }

  return tips
}

export function processBarcode(barcode: string): ScanResult {
  try {
    // Clean the barcode
    const cleanBarcode = barcode.replace(/[\s-]/g, "")

    // Get product from database
    let product = MOCK_PRODUCTS[cleanBarcode]

    // If not found, create a generic product
    if (!product) {
      product = {
        itemId: "0",
        name: "Generic Product",
        category: "Miscellaneous",
        price: "$0.00",
        description: "Product information not available",
        image: "/placeholder.svg?height=300&width=300",
        packaging: "Unknown packaging",
        carbonFootprint: "Unknown",
        attributes: {
          material: "Unknown",
          packaging: "Unknown",
          biodegradable: false,
          recyclable: false,
        },
      }
    }

    // Calculate EcoScore
    const ecoscore = generateEcoScore(product)
    product.ecoscore = ecoscore

    // Update packaging description
    product.packaging = product.attributes.recyclable ? "Recyclable" : "Non-recyclable"

    // Update carbon footprint based on EcoScore
    product.carbonFootprint = ecoscore >= 4 ? "Low" : ecoscore >= 3 ? "Medium" : "High"

    // Get sustainability tips
    product.sustainabilityTips = getSustainabilityTips(product)

    // Get alternatives
    const alternatives = getAlternatives(product)

    return {
      success: true,
      product,
      alternatives,
      barcode: cleanBarcode,
      message: `Successfully scanned ${product.name}! EcoScore: ${ecoscore}/5`,
    }
  } catch (error) {
    console.error("Error processing barcode:", error)
    return {
      success: false,
      product: {} as Product,
      alternatives: [],
      barcode,
      message: "Failed to process barcode",
    }
  }
}
