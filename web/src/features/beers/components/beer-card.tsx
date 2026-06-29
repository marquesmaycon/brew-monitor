import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import type { Beer } from '#/types/api'

type BeerCardProps = {
  beer: Beer
}

export default function BeerCard({ beer }: BeerCardProps) {
  return (
    <Card className="w-full lg:max-w-md">
      <CardHeader>
        <CardTitle>Informacoes da cerveja</CardTitle>
        <CardDescription>
          Nome e estilo usados nos registros de fermentacao.
        </CardDescription>
        <CardAction>
          <Button asChild variant="link" className="h-auto justify-start p-0">
            <Link to="/beers/$beerId/edit" params={{ beerId: beer.id }}>
              Editar <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Nome</dt>
            <dd className="font-medium">{beer.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Estilo</dt>
            <dd className="font-medium">{beer.style}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
