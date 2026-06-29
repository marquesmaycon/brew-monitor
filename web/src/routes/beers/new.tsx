import { createFileRoute, Link } from '@tanstack/react-router'

import { BeerForm } from '@/features/beers/components/beer-form'

export const Route = createFileRoute('/beers/new')({
  component: CreateBeerPage,
})

function CreateBeerPage() {
  return (
    <section className="page-wrap px-4 py-10">
      <Link to="/beers" className="text-sm font-medium">
        Voltar para cervejas
      </Link>
      <div className="mt-6">
        <h1 className="font-heading text-3xl font-semibold tracking-normal">
          Nova cerveja
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cadastre uma receita para acompanhar os parametros de fermentacao.
        </p>
      </div>
      <div className="mt-8">
        <BeerForm />
      </div>
    </section>
  )
}
