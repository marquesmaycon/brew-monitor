import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { BeerForm } from '@/features/beers/components/beer-form'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/beers/new')({
  component: CreateBeerPage,
})

function CreateBeerPage() {
  return (
    <div className="space-y-6 py-10">
      <Button asChild variant="link">
        <Link to="/beers" className="text-sm font-medium">
          <ArrowLeftIcon /> Voltar para cervejas
        </Link>
      </Button>
      <div className="mt-6">
        <h1 className="font-heading text-3xl font-semibold tracking-normal">
          Nova cerveja
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Cadastre uma receita para acompanhar os parametros de fermentacao.
        </p>
      </div>

      <BeerForm />
    </div>
  )
}
