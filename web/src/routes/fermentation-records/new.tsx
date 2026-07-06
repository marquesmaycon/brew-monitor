import { createFileRoute } from '@tanstack/react-router'

import {
  PageHeader,
  PageHeaderBackButton,
  PageHeaderTitle,
} from '@/components/page-header'
import { listBeersOptions } from '@/features/beers/api/options'
import { FermentationRecordForm } from '@/features/fermentation-records/components/fermentation-record-form'
import { listTanksOptions } from '@/features/tanks/api/options'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/fermentation-records/new')({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        listBeersOptions({ limit: 100, page: 1 }),
      ),
      context.queryClient.ensureQueryData(
        listTanksOptions({ limit: 100, page: 1 }),
      ),
    ]),
  component: CreateFermentationRecordPage,
  head: () => ({
    meta: createMetadata({
      title: 'Novo registro',
      description:
        'Cadastre uma medição de fermentação para um lote em tanque.',
    }),
  }),
})

function CreateFermentationRecordPage() {
  return (
    <div className="page-wrapper">
      <PageHeader>
        <PageHeaderBackButton />
        <PageHeaderTitle
          title="Novo registro"
          description="Cadastre uma medição de fermentação para um lote em tanque."
        />
      </PageHeader>

      <FermentationRecordForm />
    </div>
  )
}
