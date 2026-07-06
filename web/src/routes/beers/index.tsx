import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { PageHeader, PageHeaderTitle } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { listBeersOptions } from '@/features/beers/api/options'
import { BeerList } from '@/features/beers/components/beer-list'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/beers/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listBeersOptions()),
  component: BeersPage,
  head: () => ({
    meta: createMetadata({
      title: 'Cervejas',
      description:
        'Consulte e gerencie o catalogo de cervejas monitoradas na fermentação.',
    }),
  }),
})

function BeersPage() {
  return (
    <div className="page-wrapper">
      <PageHeader className="mb-8">
        <PageHeaderTitle
          title="Cervejas"
          description="Catalogo de receitas monitoradas na fermentação."
        >
          <Button asChild>
            <Link to="/beers/new">
              <Plus />
              Nova cerveja
            </Link>
          </Button>
        </PageHeaderTitle>
      </PageHeader>

      <BeerList />
    </div>
  )
}
