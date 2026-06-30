import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TankForm } from '@/features/tanks/components/tank-form'

export const Route = createFileRoute('/tanks/new')({
  component: CreateTankPage,
})

function CreateTankPage() {
  return (
    <div className="page-wrapper">
      <Button asChild variant="link">
        <Link to="/tanks" className="text-sm font-medium">
          <ArrowLeftIcon /> Voltar para tanques
        </Link>
      </Button>
      <div className="mt-6">
        <h1 className="font-heading text-3xl font-semibold tracking-normal">
          Novo tanque
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Cadastre um tanque e sua capacidade total em litros.
        </p>
      </div>

      <TankForm />
    </div>
  )
}
