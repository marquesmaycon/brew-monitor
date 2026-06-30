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
    <div className="page-wrapper">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-normal">
            Cervejas
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Catalogo de receitas monitoradas na fermentação.
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
    </div>
  )
}
