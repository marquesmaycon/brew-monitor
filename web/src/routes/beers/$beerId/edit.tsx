import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { deleteBeerOptions, getBeerOptions } from '@/features/beers/api/options'
import { BeerForm } from '@/features/beers/components/beer-form'
import FermentationParametersCard from '@/features/beers/components/fermentation-parameters-card'
import { AssociatedFermentationRecordTable } from '@/features/fermentation-records/components/associated-fermentation-record-table'
import { createMetadata } from '@/lib/metadata'
import { DestroyButton } from '#/components/form/destroy-button'
import {
  PageHeader,
  PageHeaderBackButton,
  PageHeaderTitle,
} from '#/components/page-header'

export const Route = createFileRoute('/beers/$beerId/edit')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getBeerOptions(params.beerId)),
  component: EditBeerPage,
  head: ({ loaderData }) => ({
    meta: createMetadata({
      title: loaderData ? `Editar ${loaderData.name}` : 'Editar cerveja',
      description: loaderData
        ? `Atualize a cerveja ${loaderData.name}, do estilo ${loaderData.style}.`
        : 'Atualize os dados de uma cerveja monitorada.',
    }),
  }),
})

function EditBeerPage() {
  const { beerId } = Route.useParams()
  const navigate = Route.useNavigate()

  const { data: beer } = useSuspenseQuery(getBeerOptions(beerId))

  const { mutateAsync: destroy } = useMutation(deleteBeerOptions())

  async function handleDestroy() {
    await destroy(beer.id)
    await navigate({ to: '/beers' })
  }

  return (
    <div className="page-wrapper">
      <PageHeader>
        <PageHeaderBackButton />
        <PageHeaderTitle
          title={`Editar ${beer.name} - ${beer.style}`}
          description="Atualize o nome e o estilo usados nos registros de fermentação."
        >
          <DestroyButton destroy={handleDestroy} />
        </PageHeaderTitle>
      </PageHeader>

      <div className="flex flex-col gap-8">
        <div className="flex h-full flex-col items-start justify-between gap-8 lg:flex-row-reverse">
          <FermentationParametersCard beer={beer} />

          <BeerForm beer={beer} />
        </div>

        <AssociatedFermentationRecordTable
          entityId={beer.id}
          entityType="beer"
        />
      </div>
    </div>
  )
}
