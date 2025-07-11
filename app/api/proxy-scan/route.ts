import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Forward the request to the Flask backend
    const response = await fetch(`${BACKEND_URL}/api/scan`, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type, let fetch handle it for FormData
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Proxy scan error:", error)
    return NextResponse.json({ error: "Failed to process scan request" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Barcode scanning proxy endpoint",
    backend: BACKEND_URL,
  })
}
