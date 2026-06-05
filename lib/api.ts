import { type WeatherResponse, type GeocodeResult } from "@/types/weather"

// Typed fetchers used as queryFn inside TanStack Query hooks.
// All requests go to Next.js API routes (server-side proxy)
// so the WeatherAI key is never exposed to the browser.

export async function fetchWeather(
  lat: string,
  lon: string,
): Promise<WeatherResponse> {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Failed to load weather data")
  return json
}

export async function fetchGeocode(query: string): Promise<GeocodeResult[]> {
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`)
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? "Geocoding failed")
  return json
}
