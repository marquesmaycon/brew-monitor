import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Field, FieldLabel } from '#/components/ui/field'
import { FermentationMetricsChart } from '#/features/fermentation-records/components/fermentation-metrics-chart'

import { getFermentationHistoryOptions } from '../api/options'

export function FermentationHistoryChart() {
  const [batchNumber, setBatchNumber] = useState<string>()

  const { data, isError, isFetching } = useQuery({
    ...getFermentationHistoryOptions(batchNumber),
    enabled: !!batchNumber,
  })

  useEffect(() => {
    if (!data?.selectedBatchNumber) return
    setBatchNumber(data.selectedBatchNumber)
  }, [data?.selectedBatchNumber])

  const selectedBatchNumber = data?.selectedBatchNumber ?? batchNumber

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Historico de fermentação por lote</CardTitle>
          <CardDescription>
            Temperatura, pH e extrato ao longo dos apontamentos.
          </CardDescription>
        </div>

        <Field className="w-fit">
          <FieldLabel htmlFor="batchNumber">Lote</FieldLabel>
          <Select
            value={selectedBatchNumber}
            onValueChange={setBatchNumber}
            disabled={!data?.batches.length || isError}
          >
            <SelectTrigger
              className="w-full sm:w-56"
              aria-label="Selecionar lote"
            >
              <SelectValue placeholder="Selecionar lote" />
            </SelectTrigger>
            <SelectContent align="end">
              {data?.batches.map((batch) => (
                <SelectItem key={batch.batchNumber} value={batch.batchNumber}>
                  {batch.batchNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        {selectedBatchNumber && (
          <Button
            variant="link"
            className="flex items-center gap-2 px-0"
            asChild
          >
            <Link
              to="/batches/$batchNumber"
              params={{ batchNumber: selectedBatchNumber }}
            >
              Ver histórico completo <ArrowRight />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="text-muted-foreground flex h-72 items-center justify-center rounded-lg border border-dashed text-sm">
            Nao foi possivel carregar o historico fermentativo.
          </div>
        ) : data?.data.length ? (
          <FermentationMetricsChart data={data.data} />
        ) : isFetching ? (
          <div className="text-muted-foreground flex h-72 items-center justify-center gap-2 rounded-lg border border-dashed text-sm">
            <Loader2 className="size-4 animate-spin" />
            Atualizando dados do lote...
          </div>
        ) : (
          <div className="text-muted-foreground flex h-72 items-center justify-center rounded-lg border border-dashed text-sm">
            Nenhum historico fermentativo encontrado.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
