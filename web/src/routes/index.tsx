import { createFileRoute } from '@tanstack/react-router'

import {
  getDashboardMetricsOptions,
  getFermentationHistoryOptions,
} from '#/features/dashboard/api/options'
import { DashboardCards } from '#/features/dashboard/components/dashboard-cards'
import { FermentationHistoryChart } from '#/features/dashboard/components/fermentation-history-chart'

export const Route = createFileRoute('/')({
  component: App,
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(getDashboardMetricsOptions()),
      context.queryClient.ensureQueryData(getFermentationHistoryOptions()),
    ]),
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
      <FermentationHistoryChart />
    </section>
  )
}
