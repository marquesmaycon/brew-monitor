import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { listTanksOptions } from '@/features/tanks/api/options'
import { TankList } from '@/features/tanks/components/tank-list'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/tanks/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(listTanksOptions()),
  component: TanksPage,
  head: () => ({
    meta: createMetadata({
      title: 'Tanques',
      description:
        'Gerencie os tanques usados no monitoramento de fermentacao.',
    }),
  }),
})

function TanksPage() {
  return (
    <div className="page-wrapper">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-normal">
            Tanques
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Cadastro dos tanques usados no monitoramento de fermentação.
          </p>
        </div>
        <Button asChild>
          <Link to="/tanks/new">
            <Plus />
            Novo tanque
          </Link>
        </Button>
      </div>

      <TankList />
    </div>
  )
}
