import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import {
  PageHeader,
  PageHeaderBackButton,
  PageHeaderTitle,
} from '@/components/page-header'
import { getTankOptions } from '@/features/tanks/api/options'
import { TankForm } from '@/features/tanks/components/tank-form'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/tanks/$tankId/edit')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getTankOptions(params.tankId)),
  component: EditTankPage,
  head: ({ loaderData }) => ({
    meta: createMetadata({
      title: loaderData ? `Editar ${loaderData.name}` : 'Editar tanque',
      description: loaderData
        ? `Atualize o tanque ${loaderData.name}, com capacidade de ${loaderData.capacityLiters} litros.`
        : 'Atualize os dados de um tanque monitorado.',
    }),
  }),
})

function EditTankPage() {
  const { tankId } = Route.useParams()
  const { data: tank } = useSuspenseQuery(getTankOptions(tankId))

  return (
    <div className="page-wrapper">
      <PageHeader>
        <PageHeaderBackButton />
        <PageHeaderTitle
          title={tank.name}
          description="Atualize o nome e a capacidade usados nos registros de fermentacao."
        />
      </PageHeader>

      <TankForm tank={tank} />
    </div>
  )
}
