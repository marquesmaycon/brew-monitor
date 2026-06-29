import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getTankOptions } from '@/features/tanks/api/options'
import { TankForm } from '@/features/tanks/components/tank-form'

export const Route = createFileRoute('/tanks/$tankId/edit')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getTankOptions(params.tankId)),
  component: EditTankPage,
})

function EditTankPage() {
  const { tankId } = Route.useParams()
  const { data: tank } = useSuspenseQuery(getTankOptions(tankId))

  return (
    <div className="space-y-6 py-10">
      <Button asChild variant="link">
        <Link to="/tanks" className="text-sm font-medium">
          <ArrowLeftIcon /> Voltar para tanques
        </Link>
      </Button>
      <div className="mt-6">
        <h1 className="font-heading text-3xl font-semibold tracking-normal">
          {tank.name}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Atualize o nome e a capacidade usados nos registros de fermentacao.
        </p>
      </div>

      <TankForm tank={tank} />
    </div>
  )
}
