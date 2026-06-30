import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { listBeersOptions } from '@/features/beers/api/options'
import { FermentationRecordForm } from '@/features/fermentation-records/components/fermentation-record-form'
import { listTanksOptions } from '@/features/tanks/api/options'

export const Route = createFileRoute('/fermentation-records/new')({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(listBeersOptions({ limit: 100, page: 1 })),
      context.queryClient.ensureQueryData(listTanksOptions({ limit: 100, page: 1 })),
    ]),
  component: CreateFermentationRecordPage,
})

function CreateFermentationRecordPage() {
  return (
    <div className="space-y-6 py-10">
      <Button asChild variant="link">
        <Link to="/fermentation-records" className="text-sm font-medium">
          <ArrowLeftIcon /> Voltar para registros
        </Link>
      </Button>
      <div className="mt-6">
        <h1 className="font-heading text-3xl font-semibold tracking-normal">
          Novo registro
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Cadastre uma medicao de fermentação para um lote em tanque.
        </p>
      </div>

      <FermentationRecordForm />
    </div>
  )
}
