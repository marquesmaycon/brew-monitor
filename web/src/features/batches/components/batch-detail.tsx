import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
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
import {
  classificationClasses,
  classificationLabels,
  getClassificationIcon,
} from '#/features/fermentation-records/utils/constants'

type BatchDetailProps = {
  batch: BatchDetailType
}

export function BatchDetail({ batch }: BatchDetailProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button asChild variant="link" className="-ml-4 mb-2">
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

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-sm">Cerveja</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {batch.beerName}
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-sm">Estilo</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {batch.beerStyle}
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-sm">Registros</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {batch.fermentationRecordCount}
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
