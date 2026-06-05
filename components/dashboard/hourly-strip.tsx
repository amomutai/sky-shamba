"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type HourlyForecast } from "@/types/weather";
import { getConditionLabel } from "@/lib/utils";

interface Props {
  hourly: HourlyForecast[];
}

export function HourlyStrip({ hourly }: Props) {
  // Show only the next 12 hours
  const next12 = hourly.slice(0, 12);

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-700">
          Next 12 hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {next12.map((h) => {
            const { emoji } = getConditionLabel(h.condition_code);
            const hour = new Date(h.time).toLocaleTimeString("en-US", {
              hour: "numeric",
              hour12: true,
            });

            return (
              <div
                key={h.time}
                className="flex min-w-14 flex-col items-center gap-1 rounded-xl bg-slate-50 px-2 py-3"
              >
                <span className="text-[10px] text-slate-500">{hour}</span>
                <span className="text-lg">{emoji}</span>
                <span className="text-xs font-semibold text-slate-700">
                  {Math.round(h.temperature)}°
                </span>
                {h.precipitation_probability > 10 && (
                  <span className="text-[10px] text-blue-400">
                    {h.precipitation_probability}%
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
