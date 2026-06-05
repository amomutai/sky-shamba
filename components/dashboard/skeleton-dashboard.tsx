"use client";

import { Skeleton } from "@/components/ui/skeleton";

// Shown while the dashboard fetches live weather data
export function SkeletonDashboard() {
  return (
    <div className="space-y-4">
      {/* Current weather card */}
      <Skeleton className="h-64 w-full rounded-2xl" />
      {/* Hourly strip */}
      <Skeleton className="h-24 w-full rounded-2xl" />
      {/* Chart */}
      <Skeleton className="h-64 w-full rounded-2xl" />
      {/* Daily strip */}
      <Skeleton className="h-32 w-full rounded-2xl" />
      {/* Two column: AI insight + tree analyzer */}
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    </div>
  );
}
