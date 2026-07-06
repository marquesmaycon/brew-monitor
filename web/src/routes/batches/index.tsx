import { createFileRoute } from '@tanstack/react-router'

import { PageHeader, PageHeaderTitle } from '@/components/page-header'
import { listBatchesOptions } from '@/features/batches/api/options'
import { BatchList } from '@/features/batches/components/batch-list'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/batches/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listBatchesOptions()),
  component: BatchesPage,
  head: () => ({
    meta: createMetadata({
      title: 'Lotes',
      description: 'Consulte lotes identificados nos registros de fermentação.',
    }),
  }),
})

function BatchesPage() {
  return (
    <div className="page-wrapper">
      <PageHeader className="mb-8">
        <PageHeaderTitle
          title="Lotes"
          description="Lotes encontrados nos registros de fermentação."
        />
      </PageHeader>

      <BatchList />
    </div>
  )
}
