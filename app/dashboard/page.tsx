import { Suspense } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SkeletonDashboard } from "@/components/dashboard/skeleton-dashboard"
import { DashboardClient } from "./dashboard-client"

// useSearchParams() must be inside a Suspense boundary during static generation
export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell>
          <SkeletonDashboard />
        </DashboardShell>
      }
    >
      <DashboardClient />
    </Suspense>
  )
}
