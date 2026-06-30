import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { getBatchOptions } from '@/features/batches/api/options'
import { BatchDetail } from '@/features/batches/components/batch-detail'

export const Route = createFileRoute('/batches/$batchNumber')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getBatchOptions(params.batchNumber)),
  component: BatchPage,
  errorComponent: BatchNotFound,
})

function BatchPage() {
  const batch = Route.useLoaderData()

  return (
    <section className="px-4 py-10">
      <BatchDetail batch={batch} />
    </section>
  )
}

function BatchNotFound() {
  return (
    <section className="px-4 py-10">
      <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-md border border-dashed text-center">
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            Lote nao encontrado
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Nao foi possivel carregar os apontamentos deste lote.
          </p>
        </div>
        <Button asChild>
          <Link to="/batches">Voltar para lotes</Link>
        </Button>
      </div>
    </section>
  )
}
