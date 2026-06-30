import { createFileRoute } from '@tanstack/react-router'

import { listBatchesOptions } from '@/features/batches/api/options'
import { BatchList } from '@/features/batches/components/batch-list'

export const Route = createFileRoute('/batches/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listBatchesOptions()),
  component: BatchesPage,
})

function BatchesPage() {
  return (
    <section className="page-wrap px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-normal">
            Lotes
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Lotes encontrados nos registros de fermentacao.
          </p>
        </div>
      </div>

      <BatchList />
    </section>
  )
}
