import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  getBeerFermentationParameterOptions,
  getBeerOptions,
} from '@/features/beers/api/options'
import BeerCard from '@/features/beers/components/beer-card'
import { FermentationParametersForm } from '@/features/beers/components/fermentation-parameters-form'

export const Route = createFileRoute('/beers/$beerId/parameters')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getBeerOptions(params.beerId)),
  component: RouteComponent,
})

function RouteComponent() {
  const { beerId } = Route.useParams()

  const { data: beer } = useSuspenseQuery(getBeerOptions(beerId))

  const { data: parameters } = useQuery({
    ...getBeerFermentationParameterOptions(beerId),
    retry: false,
  })

  return (
    <div className="px-4 py-10">
      <Button asChild variant="link">
        <Link to="/beers" className="text-sm font-medium">
          <ArrowLeftIcon /> Voltar para cervejas
        </Link>
      </Button>
      <div className="mt-6">
        <h1 className="font-heading text-3xl font-semibold tracking-normal">
          Parametros de fermentacao
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Configure os limites de temperatura, pH e extrato para {beer.name}.
        </p>
      </div>
      <div className="mt-8 flex flex-col items-start justify-between gap-8 lg:flex-row-reverse">
        <BeerCard beer={beer} />

        <FermentationParametersForm beerId={beerId} parameters={parameters} />
      </div>
    </div>
  )
}
