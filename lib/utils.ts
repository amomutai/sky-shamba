import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Maps WMO weather condition codes to human-readable labels and emoji.
// The API returns condition_code as a string ("0", "51", etc.) so we parse it here.
export function getConditionLabel(code: string | number): {
  label: string
  emoji: string
} {
  const n = typeof code === "string" ? parseInt(code, 10) : code
  if (n === 0) return { label: "Clear sky", emoji: "☀️" }
  if (n <= 2) return { label: "Partly cloudy", emoji: "⛅" }
  if (n === 3) return { label: "Overcast", emoji: "☁️" }
  if (n <= 49) return { label: "Foggy", emoji: "🌫️" }
  if (n <= 59) return { label: "Drizzle", emoji: "🌦️" }
  if (n <= 69) return { label: "Rain", emoji: "🌧️" }
  if (n <= 79) return { label: "Snow", emoji: "❄️" }
  if (n <= 84) return { label: "Rain showers", emoji: "🌦️" }
  if (n <= 94) return { label: "Thunderstorm", emoji: "⛈️" }
  return { label: "Unknown", emoji: "🌡️" }
}

// Converts wind degrees to compass direction
export function windDirection(degrees: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  return dirs[Math.round(degrees / 45) % 8]
}

// Returns a human-friendly UV index label
export function uvLabel(index: number): { label: string; color: string } {
  if (index <= 2) return { label: "Low", color: "text-green-600" }
  if (index <= 5) return { label: "Moderate", color: "text-yellow-500" }
  if (index <= 7) return { label: "High", color: "text-orange-500" }
  if (index <= 10) return { label: "Very High", color: "text-red-500" }
  return { label: "Extreme", color: "text-purple-600" }
}

// Returns a contextual farming tip based on condition code
export function getFarmingContext(code: string | number, temp: number): string {
  const n = typeof code === "string" ? parseInt(code, 10) : code
  if (n === 0 && temp > 30)
    return "Hot and sunny, water your crops early morning or evening to reduce evaporation."
  if (n === 0) return "Clear skies, a great day for fieldwork and harvesting."
  if (n <= 2)
    return "Partly cloudy conditions, ideal for most outdoor farm activities."
  if (n <= 59)
    return "Drizzle expected, hold off on pesticide application; chemicals may wash off."
  if (n <= 69)
    return "Rain today, check your drainage channels and avoid heavy machinery on wet soil."
  if (n <= 79)
    return "Cold and snowy, protect sensitive crops and young seedlings."
  if (n <= 84)
    return "Showers likely, a good day to stay indoors and plan your next planting cycle."
  if (n <= 94)
    return "Thunderstorm warning, secure farm equipment and stay indoors."
  return "Check the forecast before heading out."
}

// Short weekday name from a date string like "2026-06-05"
export function shortDay(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" })
}
