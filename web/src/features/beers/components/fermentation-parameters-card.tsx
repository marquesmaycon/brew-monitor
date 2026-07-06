import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  FlaskConical,
  Pipette,
  ThermometerSnowflake,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Beer } from '@/types/api'

type FermentationParametersCardProps = {
  beer: Pick<Beer, 'id' | 'fermentationParameter'>
}

export default function FermentationParametersCard({
  beer,
}: FermentationParametersCardProps) {
  return (
    <Card className="w-full lg:max-w-md">
      <CardHeader>
        <CardTitle> Parâmetros de fermentação</CardTitle>
        <CardDescription>
          Limites aceitáveis configurados para esta cerveja.
        </CardDescription>
        <CardAction>
          <Button asChild variant="link" className="h-auto justify-start p-0">
            <Link to="/beers/$beerId/parameters" params={{ beerId: beer.id }}>
              Abrir <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {beer.fermentationParameter ? (
          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground flex items-center gap-2">
                Temperatura <ThermometerSnowflake className="size-4" />
              </dt>
              <dd className="font-medium">
                {beer.fermentationParameter.minTemperature} a{' '}
                {beer.fermentationParameter.maxTemperature} ºC
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground flex items-center gap-2">
                pH <Pipette className="size-4" />
              </dt>
              <dd className="font-medium">
                {beer.fermentationParameter.minPh} a{' '}
                {beer.fermentationParameter.maxPh}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground flex items-center gap-2">
                Extrato <FlaskConical className="size-4" />
              </dt>
              <dd className="font-medium">
                {beer.fermentationParameter.minExtract} a{' '}
                {beer.fermentationParameter.maxExtract} ºP
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-muted-foreground mt-5">
            Nenhum parametro de fermentação cadastrado.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
