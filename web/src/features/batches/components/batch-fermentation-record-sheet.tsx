import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { batchKeys } from '@/features/batches/api/options'
import { FermentationRecordForm } from '@/features/fermentation-records/components/fermentation-record-form'
import type { BatchOverview } from '@/types/api'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'

type BatchFermentationRecordSheetProps = {
  batch: Pick<BatchOverview, 'batchNumber' | 'beerId'>
}

export function BatchFermentationRecordSheet({
  batch,
}: BatchFermentationRecordSheetProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon />
          Novo registro
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-3xl lg:max-w-4xl">
        <SheetHeader>
          <SheetTitle>Novo registro do lote</SheetTitle>
          <SheetDescription>
            Cadastre uma nova medicao para o lote {batch.batchNumber}.
          </SheetDescription>
        </SheetHeader>
        <div className="px-6 pb-6">
          <FermentationRecordForm
            defaultValues={{
              batchNumber: batch.batchNumber,
              beerId: batch.beerId,
            }}
            onSuccess={async () => {
              await queryClient.invalidateQueries({
                queryKey: batchKeys.root,
              })
              await router.invalidate()
              setIsOpen(false)
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
