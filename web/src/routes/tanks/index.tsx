import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { PageHeader, PageHeaderTitle } from '@/components/page-header'
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
      <PageHeader className="mb-8">
        <PageHeaderTitle
          title="Tanques"
          description="Cadastro dos tanques usados no monitoramento de fermentacao."
        >
          <Button asChild>
            <Link to="/tanks/new">
              <Plus />
              Novo tanque
            </Link>
          </Button>
        </PageHeaderTitle>
      </PageHeader>

      <TankList />
    </div>
  )
}
