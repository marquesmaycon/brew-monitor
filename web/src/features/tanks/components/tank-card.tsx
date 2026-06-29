import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Tank } from '@/types/api'

type TankCardProps = {
  tank: Tank
}

export default function TankCard({ tank }: TankCardProps) {
  return (
    <Card className="w-full lg:max-w-md">
      <CardHeader>
        <CardTitle>Informacoes do tanque</CardTitle>
        <CardDescription>Nome e capacidade em litros do tanque</CardDescription>
        <CardAction>
          <Button asChild variant="link" className="h-auto justify-start p-0">
            <Link to="/tanks/$tankId/edit" params={{ tankId: tank.id }}>
              Abrir <ArrowRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Nome</dt>
            <dd className="font-medium">{tank.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Capacidade</dt>
            <dd className="font-medium">{tank.capacityLiters} L</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
