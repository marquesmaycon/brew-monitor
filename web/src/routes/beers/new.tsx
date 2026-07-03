import { createFileRoute } from '@tanstack/react-router'

import {
  PageHeader,
  PageHeaderBackButton,
  PageHeaderTitle,
} from '@/components/page-header'
import { BeerForm } from '@/features/beers/components/beer-form'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/beers/new')({
  component: CreateBeerPage,
  head: () => ({
    meta: createMetadata({
      title: 'Nova cerveja',
      description:
        'Cadastre uma receita para acompanhar seus parametros de fermentacao.',
    }),
  }),
})

function CreateBeerPage() {
  return (
    <div className="page-wrapper">
      <PageHeader>
        <PageHeaderBackButton />
        <PageHeaderTitle
          title="Nova cerveja"
          description="Cadastre uma receita para acompanhar os parametros de fermentacao."
        />
      </PageHeader>

      <BeerForm />
    </div>
  )
}
