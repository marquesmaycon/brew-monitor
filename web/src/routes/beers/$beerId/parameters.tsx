import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { HTTPError } from 'ky'

import {
  getBeerFermentationParameterOptions,
  getBeerOptions,
} from '@/features/beers/api/options'
import { FermentationParametersForm } from '@/features/beers/components/fermentation-parameters-form'

export const Route = createFileRoute('/beers/$beerId/parameters')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getBeerOptions(params.beerId)),
  component: RouteComponent,
})

function RouteComponent() {
  const { beerId } = Route.useParams()

  const { data: beer } = useSuspenseQuery(getBeerOptions(beerId))

  const parameterQuery = useQuery({
    ...getBeerFermentationParameterOptions(beerId),
    retry: false,
  })

  const parameterNotFound =
    parameterQuery.error instanceof HTTPError &&
    parameterQuery.error.response.status === 404

  if (parameterQuery.isError && !parameterNotFound) {
    return (
      <section className="page-wrap px-4 py-10">
        <Link to="/beers" className="text-sm font-medium">
          Voltar para cervejas
        </Link>
        <div className="mt-6">
          <h1 className="font-heading text-3xl font-semibold tracking-normal">
            Parametros de fermentacao
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Nao foi possivel carregar os parametros desta cerveja.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="page-wrap px-4 py-10">
      <Link to="/beers" className="text-sm font-medium">
        Voltar para cervejas
      </Link>
      <div className="mt-6">
        <h1 className="font-heading text-3xl font-semibold tracking-normal">
          Parametros de fermentacao
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Configure os limites de temperatura, pH e extrato para {beer.name}.
        </p>
      </div>
      <div className="mt-8">
        <FermentationParametersForm
          beerId={beerId}
          parameters={parameterQuery.data}
        />
      </div>
    </section>
  )
}
