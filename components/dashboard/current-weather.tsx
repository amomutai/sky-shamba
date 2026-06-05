"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Wind, Thermometer, Sun, Gauge } from "lucide-react";
import { type CurrentWeather } from "@/types/weather";
import { getConditionLabel, windDirection, uvLabel, getFarmingContext } from "@/lib/utils";

interface Props {
  current: CurrentWeather;
  locationName: string;
}

export function CurrentWeatherCard({ current, locationName }: Props) {
  const { label, emoji } = getConditionLabel(current.condition_code);
  const uv = uvLabel(current.uv_index);
  const farmingTip = getFarmingContext(current.condition_code, current.temperature);

  // current.time comes in as "2026-06-05T09:00" — format it nicely for display
  const formatted = new Date(current.time).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card className="overflow-hidden border-0 bg-linear-to-br from-emerald-50 to-sky-50 shadow-md">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{formatted}</p>
            <h2 className="mt-0.5 text-xl font-semibold text-slate-800">{locationName}</h2>
          </div>
          <Badge variant="secondary" className="text-xs">Live</Badge>
        </div>

        {/* Big temperature */}
        <div className="flex items-end gap-4">
          <span className="text-7xl font-light tracking-tight text-slate-800">
            {Math.round(current.temperature)}°
          </span>
          <div className="mb-2">
            <p className="text-4xl">{emoji}</p>
            <p className="text-sm text-slate-600">{label}</p>
            <p className="text-xs text-slate-500">
              Feels like {Math.round(current.feels_like)}°C
            </p>
          </div>
        </div>

        {/* Stats grid — only fields the API actually returns */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile icon={<Droplets className="h-4 w-4 text-blue-400" />} label="Humidity" value={current.humidity != null ? `${current.humidity}%` : "–"} />
          <StatTile icon={<Wind className="h-4 w-4 text-slate-400" />} label="Wind" value={current.wind_speed != null ? `${current.wind_speed} km/h ${windDirection(current.wind_direction)}` : "–"} />
          <StatTile icon={<Gauge className="h-4 w-4 text-slate-400" />} label="Gusts" value={current.wind_gust != null ? `${current.wind_gust} km/h` : "–"} />
          <StatTile icon={<Sun className={`h-4 w-4 ${uv.color}`} />} label="UV Index" value={current.uv_index != null ? `${current.uv_index} · ${uv.label}` : "–"} />
        </div>

        {/* Farming tip */}
        <div className="mt-5 rounded-lg bg-emerald-100/70 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Farming tip</p>
          <p className="mt-1 text-sm text-emerald-800">{farmingTip}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-white/60 px-2 py-2 text-center">
      {icon}
      <p className="text-[10px] text-slate-500">{label}</p>
      <p className="text-xs font-medium text-slate-700">{value}</p>
    </div>
  );
}
