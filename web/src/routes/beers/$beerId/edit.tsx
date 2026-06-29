import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getBeerOptions } from '@/features/beers/api/options'
import { BeerForm } from '@/features/beers/components/beer-form'
import FermentationParametersCard from '@/features/beers/components/fermentation-parameters-card'

export const Route = createFileRoute('/beers/$beerId/edit')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getBeerOptions(params.beerId)),
  component: EditBeerPage,
})

function EditBeerPage() {
  const { beerId } = Route.useParams()
  const { data: beer } = useSuspenseQuery(getBeerOptions(beerId))

  return (
    <div className="space-y-6 py-10">
      <Button asChild variant="link">
        <Link to="/beers" className="text-sm font-medium">
          <ArrowLeftIcon /> Voltar para cervejas
        </Link>
      </Button>
      <div className="mt-6">
        <h1 className="font-heading text-3xl font-semibold tracking-normal">
          {beer.name} - {beer.style}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Atualize o nome e o estilo usados nos registros de fermentacao.
        </p>
      </div>

      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row-reverse">
        <FermentationParametersCard beer={beer} />

        <BeerForm beer={beer} />
      </div>
    </div>
  )
}
