import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { listBeersOptions } from '@/features/beers/api/options'
import { BeerList } from '@/features/beers/components/beer-list'

export const Route = createFileRoute('/beers/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listBeersOptions()),
  component: BeersPage,
})

function BeersPage() {
  return (
    <section className="page-wrap px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-normal">
            Cervejas
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
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

      <BeerList />
    </section>
  )
}
