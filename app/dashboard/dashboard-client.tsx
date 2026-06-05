"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Sprout, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CurrentWeatherCard } from "@/components/dashboard/current-weather"
import { ForecastChart } from "@/components/dashboard/forecast-chart"
import { DailyStrip } from "@/components/dashboard/daily-strip"
import { HourlyStrip } from "@/components/dashboard/hourly-strip"
import { AiInsight } from "@/components/dashboard/ai-insight"
import { TreeAnalyzer } from "@/components/dashboard/tree-analyzer"
import { SkeletonDashboard } from "@/components/dashboard/skeleton-dashboard"
import { fetchWeather } from "@/lib/api"

export function DashboardClient() {
  const params = useSearchParams()
  const router = useRouter()

  const lat = params.get("lat")
  const lon = params.get("lon")
  const locationName = params.get("location") ?? "Your Farm"

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat!, lon!),
    enabled: !!lat && !!lon,
  })

  if (!lat || !lon) router.replace("/")

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50">
      {/* Sticky nav */}
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Search
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <Sprout className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold text-slate-800">Sky Shamba</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-slate-500 hover:text-slate-800"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-4xl space-y-4 px-4 py-6">
        {isLoading && <SkeletonDashboard />}

        {isError && (
          <div className="rounded-2xl bg-red-50 p-6 text-center">
            <p className="font-medium text-red-600">
              {(error as Error)?.message}
            </p>
            <p className="mt-1 text-sm text-red-400">
              Make sure your{" "}
              <code className="font-mono">WEATHER_AI_API_KEY</code> is set in{" "}
              <code className="font-mono">.env.local</code>
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </div>
        )}

        {data && (
          <>
            <CurrentWeatherCard
              current={data.current}
              locationName={locationName}
            />

            {data.hourly?.length > 0 && <HourlyStrip hourly={data.hourly} />}

            {data.daily?.length > 0 && <ForecastChart daily={data.daily} />}

            {data.daily?.length > 0 && <DailyStrip daily={data.daily} />}

            <div className="grid gap-4 ">
              {data.ai_summary && <AiInsight summary={data.ai_summary} />}
              <TreeAnalyzer />
            </div>
          </>
        )}
      </main>

      <footer className="py-8 text-center text-xs text-slate-400">
        Sky Shamba · Powered by{" "}
        <a
          href="https://weather-ai.co"
          className="underline hover:text-slate-600"
          target="_blank"
          rel="noreferrer"
        >
          WeatherAI
        </a>{" "}
        · Built for farmers across Africa
      </footer>
    </div>
  )
}
