import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { deleteBeerOptions, getBeerOptions } from '@/features/beers/api/options'
import { BeerForm } from '@/features/beers/components/beer-form'
import FermentationParametersCard from '@/features/beers/components/fermentation-parameters-card'
import { createMetadata } from '@/lib/metadata'
import { DestroyButton } from '#/components/form/destroy-button'

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

  const { mutateAsync: destroy, isPending: isDestroying } =
    useMutation(deleteBeerOptions())

  async function handleDestroy() {
    await destroy(beer.id)
    await navigate({ to: '/beers' })
  }

  return (
    <div className="page-wrapper">
      <Button
        asChild
        variant="link"
        className="px-0 text-xs font-medium md:text-sm"
      >
        <Link to="/beers">
          <ArrowLeftIcon /> Voltar para cervejas
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-2 md:justify-between">
        <div className="mr-auto">
          <h1 className="font-heading text-2xl font-semibold tracking-normal md:text-3xl">
            {beer.name} - {beer.style}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Atualize o nome e o estilo usados nos registros de fermentação.
          </p>
        </div>
        <DestroyButton disabled={isDestroying} destroy={handleDestroy} />
      </div>

      <div className="flex h-full flex-col items-start justify-between gap-8 lg:flex-row-reverse">
        <FermentationParametersCard beer={beer} />

        <BeerForm beer={beer} />
      </div>
    </div>
  )
}
