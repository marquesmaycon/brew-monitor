import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Edit, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { listBeersOptions } from '@/features/beers/api/options'

export const Route = createFileRoute('/beers/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listBeersOptions()),
  component: BeersPage,
})

function BeersPage() {
  const { data: beers } = useSuspenseQuery(listBeersOptions())

  return (
    <section className="page-wrap px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-normal">
            Cervejas
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Catalogo de receitas monitoradas na fermentacao.
          </p>
        </div>
        <Button asChild>
          <Link to="/beers/new">
            <Plus />
            Nova cerveja
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-4 border-b bg-muted/40 px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">
          <span>Nome</span>
          <span>Estilo</span>
          <span>Acoes</span>
        </div>
        {beers.length > 0 ? (
          beers.map((beer) => (
            <div
              key={beer.id}
              className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 border-b px-4 py-3 last:border-b-0"
            >
              <span className="font-medium">{beer.name}</span>
              <span className="text-sm text-muted-foreground">
                {beer.style}
              </span>
              <Button variant="ghost" size="icon-sm" asChild>
                <Link to="/beers/$beerId/edit" params={{ beerId: beer.id }}>
                  <Edit />
                  <span className="sr-only">Editar {beer.name}</span>
                </Link>
              </Button>
            </div>
          ))
        ) : (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            Nenhuma cerveja cadastrada.
          </div>
        )}
      </div>
    </section>
  )
}
