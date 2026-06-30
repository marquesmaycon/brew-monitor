import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { listBeersOptions } from '@/features/beers/api/options'
import { getFermentationRecordOptions } from '@/features/fermentation-records/api/options'
import { FermentationRecordForm } from '@/features/fermentation-records/components/fermentation-record-form'
import { FermentationRecordSummary } from '@/features/fermentation-records/components/fermentation-record-summary'
import { listTanksOptions } from '@/features/tanks/api/options'

export const Route = createFileRoute('/fermentation-records/$recordId/edit')({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        getFermentationRecordOptions(params.recordId),
      ),
      context.queryClient.ensureQueryData(listBeersOptions({ limit: 100, page: 1 })),
      context.queryClient.ensureQueryData(listTanksOptions({ limit: 100, page: 1 })),
    ]),
  component: EditFermentationRecordPage,
})

function EditFermentationRecordPage() {
  const { recordId } = Route.useParams()
  const { data: record } = useSuspenseQuery(
    getFermentationRecordOptions(recordId),
  )

  return (
    <div className="page-wrapper">
      <Button asChild variant="link">
        <Link to="/fermentation-records" className="text-sm font-medium">
          <ArrowLeftIcon /> Voltar para registros
        </Link>
      </Button>
      <div className="mt-6">
        <h1 className="font-heading text-3xl font-semibold tracking-normal">
          {record.batchNumber}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Atualize a medicao e permita que a classificação seja recalculada.
        </p>
      </div>

      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row-reverse">
        <FermentationRecordSummary record={record} />
        <FermentationRecordForm record={record} />
      </div>
    </div>
  )
}