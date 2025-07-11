import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

interface EcoScoreRequest {
  gtin: string
  productData: {
    isOrganic: boolean
    hasPlastic: boolean
    isLocal: boolean
    baseScore: number
  }
}

interface EcoScore {
  base: number
  adjustments: {
    isOrganic: number
    hasPlastic: number
    isLocal: number
  }
  final: number
}

export async function POST(request: NextRequest) {
  try {
    const { gtin, productData }: EcoScoreRequest = await request.json()

    // Validate GTIN format (UPC-12)
    const upcRegex = /^[0-9]{12}$/
    if (!upcRegex.test(gtin)) {
      return NextResponse.json({ error: "Invalid GTIN format" }, { status: 400 })
    }

    // Calculate EcoScore using the algorithm
    const ecoScore: EcoScore = {
      base: productData.baseScore,
      adjustments: {
        isOrganic: productData.isOrganic ? 15 : 0,
        hasPlastic: productData.hasPlastic ? -20 : 0,
        isLocal: productData.isLocal ? 10 : 0,
      },
      final: 0,
    }

    // Calculate final score (clamped 0-100)
    const rawFinal =
      ecoScore.base + ecoScore.adjustments.isOrganic + ecoScore.adjustments.hasPlastic + ecoScore.adjustments.isLocal

    ecoScore.final = Math.max(0, Math.min(100, rawFinal))

    // Log for analytics (in production, send to analytics service)
    console.log(`EcoScore calculated for GTIN ${gtin}: ${ecoScore.final}`)

    return NextResponse.json({
      gtin,
      ecoScore,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("EcoScore calculation error:", error)
    return NextResponse.json({ error: "Failed to calculate EcoScore" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const gtin = searchParams.get("gtin")

  if (!gtin) {
    return NextResponse.json({ error: "GTIN parameter required" }, { status: 400 })
  }

  // Return cached score or default
  return NextResponse.json({
    gtin,
    cached: true,
    ecoScore: {
      base: 70,
      adjustments: { isOrganic: 0, hasPlastic: 0, isLocal: 0 },
      final: 70,
    },
  })
}
