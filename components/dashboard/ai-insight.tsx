"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface Props {
  summary: string;
}

export function AiInsight({ summary }: Props) {
  return (
    <Card className="border-0 bg-linear-to-br from-violet-50 to-sky-50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-violet-700">
          <Sparkles className="h-4 w-4" />
          AI Agronomic Insight
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* The summary comes verbatim from Gemini via the WeatherAI API */}
        <p className="leading-relaxed text-sm text-slate-700 whitespace-pre-line">
          {summary}
        </p>
        <p className="mt-3 text-[11px] text-slate-400">
          Powered by Gemini · WeatherAI
        </p>
      </CardContent>
    </Card>
  );
}
