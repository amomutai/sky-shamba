export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50">
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">{children}</div>
    </div>
  );
}
