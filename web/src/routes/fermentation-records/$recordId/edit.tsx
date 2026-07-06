import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { DestroyButton } from '@/components/form/destroy-button'
import {
  PageHeader,
  PageHeaderBackButton,
  PageHeaderTitle,
} from '@/components/page-header'
import {
  deleteFermentationRecordOptions,
  getFermentationRecordOptions,
} from '@/features/fermentation-records/api/options'
import { FermentationRecordForm } from '@/features/fermentation-records/components/fermentation-record-form'
import { FermentationRecordSummary } from '@/features/fermentation-records/components/fermentation-record-summary'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/fermentation-records/$recordId/edit')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      getFermentationRecordOptions(params.recordId),
    ),
  component: EditFermentationRecordPage,
  head: ({ loaderData, params }) => {
    return {
      meta: createMetadata({
        title: loaderData
          ? `Editar registro do lote ${loaderData.batchNumber}`
          : 'Editar registro',
        description: loaderData
          ? `Atualize a medição do lote ${loaderData.batchNumber} para ${loaderData.beer.name} no tanque ${loaderData.tank.name}.`
          : `Atualize a medição do registro ${params.recordId}.`,
      }),
    }
  },
})

function EditFermentationRecordPage() {
  const { recordId } = Route.useParams()
  const navigate = Route.useNavigate()
  const { data: record } = useSuspenseQuery(
    getFermentationRecordOptions(recordId),
  )

  const { mutateAsync: destroy } = useMutation(deleteFermentationRecordOptions())

  async function handleDestroy() {
    await destroy(record.id)
    await navigate({ to: '/fermentation-records' })
  }

  return (
    <div className="page-wrapper">
      <PageHeader>
        <PageHeaderBackButton />
        <PageHeaderTitle
          title={record.batchNumber}
          description="Atualize a medição e permita que a classificação seja recalculada."
        >
          <DestroyButton destroy={handleDestroy} />
        </PageHeaderTitle>
      </PageHeader>

      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row-reverse">
        <FermentationRecordSummary record={record} />
        <FermentationRecordForm record={record} />
      </div>
    </div>
  )
}
