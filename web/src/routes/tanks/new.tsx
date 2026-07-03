import { createFileRoute } from '@tanstack/react-router'

import {
  PageHeader,
  PageHeaderBackButton,
  PageHeaderTitle,
} from '@/components/page-header'
import { TankForm } from '@/features/tanks/components/tank-form'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/tanks/new')({
  component: CreateTankPage,
  head: () => ({
    meta: createMetadata({
      title: 'Novo tanque',
      description: 'Cadastre um tanque e sua capacidade total em litros.',
    }),
  }),
})

function CreateTankPage() {
  return (
    <div className="page-wrapper">
      <PageHeader>
        <PageHeaderBackButton />
        <PageHeaderTitle
          title="Novo tanque"
          description="Cadastre um tanque e sua capacidade total em litros."
        />
      </PageHeader>

      <TankForm />
    </div>
  )
}
