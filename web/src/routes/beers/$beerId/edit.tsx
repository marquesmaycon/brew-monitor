import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

import { getBeerOptions } from '@/features/beers/api/options'
import { BeerForm } from '@/features/beers/components/beer-form'

export const Route = createFileRoute('/beers/$beerId/edit')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getBeerOptions(params.beerId)),
  component: EditBeerPage,
})

function EditBeerPage() {
  const { beerId } = Route.useParams()
  const { data: beer } = useSuspenseQuery(getBeerOptions(beerId))

  return (
    <section className="page-wrap px-4 py-10">
      <Link to="/beers" className="text-sm font-medium">
        Voltar para cervejas
      </Link>
      <div className="mt-6">
        <h1 className="font-heading text-3xl font-semibold tracking-normal">
          Editar cerveja
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Atualize o nome e o estilo usados nos registros de fermentacao.
        </p>
      </div>
      <div className="mt-8">
        <BeerForm beer={beer} />
      </div>
    </section>
  )
}
