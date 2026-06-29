import { createFileRoute } from '@tanstack/react-router'

import { getDashboardMetricsOptions } from '#/features/dashboard/api/options'
import { DashboardCards } from '#/features/dashboard/components/dashboard-cards'

export const Route = createFileRoute('/')({
  component: App,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(getDashboardMetricsOptions()),
})

function App() {
  return (
    <section className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Indicadores iniciais dos apontamentos fermentativos cadastrados.
        </p>
      </div>

      <DashboardCards />
    </section>
  )
}
