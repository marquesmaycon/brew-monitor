import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getBatchOptions } from '@/features/batches/api/options'
import { BatchClassificationPieChart } from '@/features/batches/components/batch-classification-pie-chart'
import { BatchFermentationRecordSheet } from '@/features/batches/components/batch-fermentation-record-sheet'
import { BatchFermentationRecordTable } from '@/features/batches/components/batch-fermentation-record-table'
import { FermentationMetricsChart } from '@/features/fermentation-records/components/fermentation-metrics-chart'
import { createMetadata } from '@/lib/metadata'

export const Route = createFileRoute('/batches/$batchNumber')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(getBatchOptions(params.batchNumber)),
  component: BatchPage,
  errorComponent: BatchNotFound,
  head: ({ loaderData, params }) => ({
    meta: createMetadata({
      title: `Lote ${loaderData?.batchNumber ?? params.batchNumber}`,
      description: loaderData
        ? `Historico fermentativo do lote ${loaderData.batchNumber} da cerveja ${loaderData.beerName}.`
        : `Historico fermentativo do lote ${params.batchNumber}.`,
    }),
  }),
})

function BatchPage() {
  const batch = Route.useLoaderData()

  const metricData = batch.metricPoints.map((record) => ({
    registeredAt: record.registeredAt,
    temperature: record.temperature,
    ph: record.ph,
    extract: record.extract,
  }))

  return (
    <div className="page-wrapper">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Button asChild variant="link" className="mb-2 -ml-4">
              <Link to="/batches">
                <ArrowLeft />
                Voltar para lotes
              </Link>
            </Button>
            <h1 className="font-heading text-3xl font-semibold tracking-normal">
              Lote {batch.batchNumber}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {batch.beerName} - {batch.beerStyle}
            </p>
          </div>
          <BatchFermentationRecordSheet batch={batch} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Historico de fermentacao</CardTitle>
              <CardDescription>
                Temperatura, pH e extrato ao longo dos apontamentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metricData.length ? (
                <FermentationMetricsChart data={metricData} />
              ) : (
                <div className="text-muted-foreground flex h-72 items-center justify-center rounded-lg border border-dashed text-sm">
                  Nenhum historico fermentativo encontrado.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Classificacao</CardTitle>
              <CardDescription>
                Distribuicao dos registros deste lote.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BatchClassificationPieChart
                classificationCounts={batch.classificationCounts}
              />
            </CardContent>
          </Card>
        </div>

        <BatchFermentationRecordTable batchNumber={batch.batchNumber} />
      </div>
    </div>
  )
}

function BatchNotFound() {
  return (
    <div className="page-wrapper">
      <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-md border border-dashed text-center">
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            Lote nao encontrado
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Nao foi possivel carregar os apontamentos deste lote.
          </p>
        </div>
        <Button asChild>
          <Link to="/batches">Voltar para lotes</Link>
        </Button>
      </div>
    </div>
  )
}
