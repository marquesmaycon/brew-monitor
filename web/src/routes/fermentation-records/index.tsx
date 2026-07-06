import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { PageHeader, PageHeaderTitle } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { listFermentationRecordsOptions } from '@/features/fermentation-records/api/options'
import { FermentationRecordList } from '@/features/fermentation-records/components/fermentation-record-list'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/fermentation-records/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listFermentationRecordsOptions()),
  component: FermentationRecordsPage,
  head: () => ({
    meta: createMetadata({
      title: 'Registros de fermentação',
      description:
        'Acompanhe medicoes de lote por cerveja, tanque e classificação.',
    }),
  }),
})

function FermentationRecordsPage() {
  return (
    <div className="page-wrapper">
      <PageHeader className="mb-8">
        <PageHeaderTitle
          title="Registros de fermentação"
          description="Acompanhe medicoes de lote por cerveja, tanque e classificação."
        >
          <Button asChild>
            <Link to="/fermentation-records/new">
              <Plus />
              Novo registro
            </Link>
          </Button>
        </PageHeaderTitle>
      </PageHeader>

      <FermentationRecordList />
    </div>
  )
}
