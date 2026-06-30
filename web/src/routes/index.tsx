import { createFileRoute } from '@tanstack/react-router'

import {
  getDashboardMetricsOptions,
  getFermentationHistoryOptions,
} from '#/features/dashboard/api/options'
import { DashboardCards } from '#/features/dashboard/components/dashboard-cards'
import { FermentationHistoryChart } from '#/features/dashboard/components/fermentation-history-chart'
import { createMetadata } from '#/lib/metadata'

export const Route = createFileRoute('/')({
  component: App,
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(getDashboardMetricsOptions()),
      context.queryClient.ensureQueryData(getFermentationHistoryOptions()),
    ]),
  head: () => ({
    meta: createMetadata({
      title: 'Dashboard',
      description:
        'Acompanhe indicadores e historico dos apontamentos fermentativos cadastrados.',
    }),
  }),
})

function App() {
  return (
    <div className="page-wrapper">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Indicadores iniciais dos apontamentos fermentativos cadastrados.
        </p>
      </div>

      <section className="flex flex-col gap-8">
        <DashboardCards />
        <FermentationHistoryChart />
      </section>
    </div>
  )
}
