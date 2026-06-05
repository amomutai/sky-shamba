import { type NextRequest } from "next/server"

// Resolves a place name to coordinates using OpenStreetMap Nominatim.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const q = searchParams.get("q")

  if (!q) {
    return Response.json({ error: "q (query) is required" }, { status: 400 })
  }

  const upstream = new URL("https://nominatim.openstreetmap.org/search")
  upstream.searchParams.set("q", q)
  upstream.searchParams.set("format", "json")
  upstream.searchParams.set("limit", "5")
  upstream.searchParams.set("addressdetails", "1")

  const res = await fetch(upstream.toString(), {
    headers: {
      // Nominatim requires a descriptive User-Agent with contact info
      "User-Agent": `SkyShamba/1.0 (${process.env.NOMINATIM_CONTACT_EMAIL ?? "contact@example.com"})`,
      "Accept-Language": "en",
    },
    next: { revalidate: 86400 }, // geocoding results are stable; cache for 24h
  })

  if (!res.ok) {
    return Response.json({ error: "Geocoding failed" }, { status: res.status })
  }

  const data = await res.json()
  return Response.json(data)
}
