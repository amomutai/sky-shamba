"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2, MapPin, Sprout } from "lucide-react"
import { type GeocodeResult } from "@/types/weather"
import { fetchGeocode } from "@/lib/api"
import { useDebounce } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import { LOCATION_QUICK_PICKS } from "@/lib/constants"

export default function HomePage() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const debouncedQuery = useDebounce(inputValue, 350)

  const { data: results = [], isFetching } = useQuery<GeocodeResult[]>({
    queryKey: ["geocode", debouncedQuery],
    queryFn: () => fetchGeocode(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 24 * 60 * 60 * 1000,
  })

  function goToDashboard(lat: number, lon: number, name: string) {
    router.push(
      `/dashboard?lat=${lat}&lon=${lon}&location=${encodeURIComponent(name)}`,
    )
  }

  function onSelectResult(r: GeocodeResult) {
    const name =
      r.address.city ||
      r.address.town ||
      r.address.village ||
      r.display_name.split(",")[0]
    goToDashboard(parseFloat(r.lat), parseFloat(r.lon), name)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && results.length > 0) onSelectResult(results[0])
  }

  function useMyLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        goToDashboard(pos.coords.latitude, pos.coords.longitude, "My Location"),
      () => alert("Could not get your location. Please search manually."),
    )
  }

  const open = debouncedQuery.length >= 2 && results.length > 0

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-emerald-50 via-white to-sky-50 px-4">
      {/* Brand */}
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2">
          <Sprout className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold text-emerald-700 tracking-wide">
            Sky Shamba
          </span>
        </div>
        <h1 className="max-w-md text-4xl font-bold tracking-tight text-slate-800">
          Weather that speaks <span className="text-emerald-600">farmer</span>
        </h1>
        <p className="max-w-sm text-base text-slate-500">
          Real-time conditions, 7-day forecasts, and AI-powered agronomic advice
          all in one place for your farm.
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9 h-12 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-emerald-400"
              placeholder="Search for a city or region…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
            />
            {isFetching && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
            )}
          </div>
          <Button
            variant="outline"
            className="h-12 rounded-xl border-slate-200 bg-white px-3 shadow-sm hover:bg-emerald-50"
            onClick={useMyLocation}
            title="Use my current location"
          >
            <MapPin className="h-4 w-4 text-emerald-600" />
          </Button>
        </div>

        {/* Autocomplete dropdown */}
        {open && results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-100 bg-white shadow-xl">
            {results.map((r, i) => {
              const city =
                r.address.city ||
                r.address.town ||
                r.address.village ||
                r.display_name.split(",")[0]
              const country = r.address.country ?? ""

              return (
                <button
                  key={i}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-emerald-50",
                    i === 0 && "rounded-t-xl",
                    i === results.length - 1 && "rounded-b-xl",
                  )}
                  onClick={() => onSelectResult(r)}
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="font-medium text-slate-700">{city}</span>
                  <span className="truncate text-slate-400">{country}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick picks */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {LOCATION_QUICK_PICKS.map((p) => (
          <button
            key={p.label}
            onClick={() => goToDashboard(p.lat, p.lon, p.label)}
            className="rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-sm text-emerald-700 shadow-sm transition hover:bg-emerald-50"
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="absolute bottom-6 text-xs text-slate-400">
        Powered by WeatherAI · Built for farmers across Africa
      </p>
    </main>
  )
}
