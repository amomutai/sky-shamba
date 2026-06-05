"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type DailyForecast } from "@/types/weather";
import { getConditionLabel, shortDay } from "@/lib/utils";

interface Props {
  daily: DailyForecast[];
}

export function DailyStrip({ daily }: Props) {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-700">
          Day-by-day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {daily.map((d) => {
            const { emoji } = getConditionLabel(d.condition_code);
            return (
              <div
                key={d.date}
                className="flex flex-col items-center gap-1 rounded-xl px-1 py-3 transition hover:bg-emerald-50"
              >
                <span className="text-[11px] font-medium text-slate-500">
                  {shortDay(d.date)}
                </span>
                <span className="text-xl">{emoji}</span>
                <span className="text-xs font-semibold text-orange-500">
                  {d.temp_max}°
                </span>
                <span className="text-xs text-sky-400">{d.temp_min}°</span>
                {d.precipitation_probability > 20 && (
                  <span className="text-[10px] text-blue-400">
                    {d.precipitation_probability}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
