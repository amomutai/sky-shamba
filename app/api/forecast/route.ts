import { WEATHER_API_BASE_URL } from "@/lib/constants"
import { type NextRequest } from "next/server"

// Returns the 7-day daily breakdown for the forecast chart.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return Response.json({ error: "lat and lon are required" }, { status: 400 })
  }

  const apiKey = process.env.WEATHER_AI_API_KEY
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 })
  }

  const upstream = new URL(`${WEATHER_API_BASE_URL}/v1/daily`)
  upstream.searchParams.set("lat", lat)
  upstream.searchParams.set("lon", lon)
  upstream.searchParams.set("days", "7")
  upstream.searchParams.set("units", "metric")

  const res = await fetch(upstream.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  })

  if (!res.ok) {
    const body = await res.text()
    return Response.json({ error: body }, { status: res.status })
  }

  const data = await res.json()
  return Response.json(data)
}
