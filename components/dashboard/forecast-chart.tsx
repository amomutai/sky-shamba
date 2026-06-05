"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type DailyForecast } from "@/types/weather";
import { shortDay, getConditionLabel } from "@/lib/utils";

interface Props {
  daily: DailyForecast[];
}

// Recharts custom tooltip that shows the full day info on hover
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const { emoji } = getConditionLabel(d.condition_code);

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-800">
        {emoji} {label}
      </p>
      <p className="text-orange-500">High: {d.temp_max}°C</p>
      <p className="text-sky-500">Low: {d.temp_min}°C</p>
      <p className="text-blue-400">Rain: {d.precipitation_probability}%</p>
    </div>
  );
}

export function ForecastChart({ daily }: Props) {
  const data = daily.map((d) => ({
    day: shortDay(d.date),
    temp_max: d.temp_max,
    temp_min: d.temp_min,
    rain: d.precipitation_probability,
    condition_code: d.condition_code,
  }));

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-700">
          7-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="temp" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="rain" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            {/* Rain chance as soft bars in the background */}
            <Bar yAxisId="rain" dataKey="rain" name="Rain %" fill="#bae6fd" radius={[4, 4, 0, 0]} barSize={18} />
            {/* Temperature lines on top */}
            <Line yAxisId="temp" type="monotone" dataKey="temp_max" name="High °C" stroke="#f97316" strokeWidth={2} dot={{ r: 4, fill: "#f97316" }} />
            <Line yAxisId="temp" type="monotone" dataKey="temp_min" name="Low °C" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4, fill: "#38bdf8" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
