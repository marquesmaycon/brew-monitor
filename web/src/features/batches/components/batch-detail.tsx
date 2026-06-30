import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { BatchDetail as BatchDetailType } from '@/types/api'
import { Badge } from '#/components/ui/badge'
import { FermentationMetricsChart } from '#/features/fermentation-records/components/fermentation-metrics-chart'
import {
  classificationClasses,
  classificationLabels,
  getClassificationIcon,
} from '#/features/fermentation-records/utils/constants'

import { BatchClassificationPieChart } from './batch-classification-pie-chart'

type BatchDetailProps = {
  batch: BatchDetailType
}

export function BatchDetail({ batch }: BatchDetailProps) {
  const metricData = batch.fermentationRecords.map((record) => ({
    registeredAt: record.registeredAt,
    temperature: record.temperature,
    ph: record.ph,
    extract: record.extract,
  }))

  return (
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
            <BatchClassificationPieChart records={batch.fermentationRecords} />
          </CardContent>
        </Card>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registro</TableHead>
              <TableHead>Tanque</TableHead>
              <TableHead>Temp.</TableHead>
              <TableHead>pH</TableHead>
              <TableHead>Extrato</TableHead>
              <TableHead>Classificacao</TableHead>
              <TableHead>Observacoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batch.fermentationRecords.map((record) => {
              const Icon = getClassificationIcon(record.classification)

              return (
                <TableRow key={record.id}>
                  <TableCell>
                    {new Date(record.registeredAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {record.tankName} ({record.tankCapacityLiters} L)
                  </TableCell>
                  <TableCell>{record.temperature} C</TableCell>
                  <TableCell>{record.ph}</TableCell>
                  <TableCell>{record.extract} P</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={classificationClasses[record.classification]}
                    >
                      <Icon />
                      {classificationLabels[record.classification]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-sm">
                    {record.notes || '-'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
