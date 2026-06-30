import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { listFermentationRecordsOptions } from '@/features/fermentation-records/api/options'
import { FermentationRecordList } from '@/features/fermentation-records/components/fermentation-record-list'

export const Route = createFileRoute('/fermentation-records/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listFermentationRecordsOptions()),
  component: FermentationRecordsPage,
})

function FermentationRecordsPage() {
  return (
    <div className="page-wrapper">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-normal">
            Registros de fermentação
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Acompanhe medições de lote por cerveja, tanque e classificação.
          </p>
        </div>
        <Button asChild>
          <Link to="/fermentation-records/new">
            <Plus />
            Novo registro
          </Link>
        </Button>
      </div>

      <FermentationRecordList />
    </div>
  )
}
