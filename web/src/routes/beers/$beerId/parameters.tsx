import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import {
  PageHeader,
  PageHeaderBackButton,
  PageHeaderTitle,
} from '@/components/page-header'
import {
  getBeerFermentationParameterOptions,
  getBeerOptions,
} from '@/features/beers/api/options'
import BeerCard from '@/features/beers/components/beer-card'
import { FermentationParametersForm } from '@/features/beers/components/fermentation-parameters-form'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/beers/$beerId/parameters')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getBeerOptions(params.beerId)),
  component: RouteComponent,
  head: ({ loaderData }) => ({
    meta: createMetadata({
      title: loaderData
        ? `Parâmetros de ${loaderData.name}`
        : 'Parâmetros de fermentação',
      description: loaderData
        ? `Configure limites de temperatura, pH e extrato para ${loaderData.name}.`
        : 'Configure os parâmetros de fermentação de uma cerveja.',
    }),
  }),
})

function RouteComponent() {
  const { beerId } = Route.useParams()

  const { data: beer } = useSuspenseQuery(getBeerOptions(beerId))

  const { data: parameters } = useQuery({
    ...getBeerFermentationParameterOptions(beerId),
    retry: false,
  })

  return (
    <div className="page-wrapper">
      <PageHeader>
        <PageHeaderBackButton />
        <PageHeaderTitle
          title="Parâmetros de fermentação"
          description={`Configure os limites de temperatura, pH e extrato para ${beer.name}.`}
        />
      </PageHeader>

      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row-reverse">
        <BeerCard beer={beer} />

        <FermentationParametersForm beerId={beerId} parameters={parameters} />
      </div>
    </div>
  )
}
