import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import type { ChartConfig } from '@/components/ui/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

import { getFermentationHistoryOptions } from '../api/options'

const chartConfig = {
  temperature: {
    label: 'Temperatura',
    color: 'var(--color-chart-2)',
  },
  ph: {
    label: 'pH',
    color: 'var(--color-chart-3)',
  },
  extract: {
    label: 'Extrato',
    color: 'var(--color-chart-4)',
  },
} satisfies ChartConfig

function getMetricDomain(
  data: Array<{ temperature: number; ph: number; extract: number }>,
) {
  const values = data.flatMap((point) => [
    point.temperature,
    point.ph,
    point.extract,
  ])
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min
  const padding = range === 0 ? 1 : range * 0.01

  return [Math.floor(min - padding), Math.ceil(max + padding)] as const
}

export function FermentationHistoryChart() {
  const [batchNumber, setBatchNumber] = useState<string>()
  const { data, isError, isFetching } = useQuery(
    getFermentationHistoryOptions(batchNumber),
  )

  const selectedBatchNumber = batchNumber ?? data?.selectedBatchNumber ?? ''
  const yAxisDomain = data?.data.length ? getMetricDomain(data.data) : [0, 1]

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Historico de fermentacao por lote</CardTitle>
          <CardDescription>
            Temperatura, pH e extrato ao longo dos apontamentos.
          </CardDescription>
        </div>

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
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="text-muted-foreground flex h-72 items-center justify-center rounded-lg border border-dashed text-sm">
            Nao foi possivel carregar o historico fermentativo.
          </div>
        ) : data?.data.length ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-72 w-full"
          >
            <AreaChart
              accessibilityLayer
              data={data.data}
              margin={{ bottom: 8, left: 0, right: 12, top: 12 }}
            >
              <defs>
                <linearGradient
                  id="fillTemperature"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-sky-500)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="50%"
                    stopColor="var(--color-sky-500)"
                    stopOpacity={0.04}
                  />
                </linearGradient>
                <linearGradient id="fillPh" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-amber-500)"
                    stopOpacity={0.28}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-amber-500)"
                    stopOpacity={0.03}
                  />
                </linearGradient>
                <linearGradient id="fillExtract" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-indigo-500)"
                    stopOpacity={0.24}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-indigo-500)"
                    stopOpacity={0.03}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="registeredAt"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={(value) =>
                  format(new Date(String(value)), 'dd/MM HH:mm')
                }
              />
              <YAxis
                width={36}
                domain={yAxisDomain}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value) =>
                      format(new Date(String(value)), 'dd/MM/yyyy HH:mm')
                    }
                  />
                }
              />
              <Area
                dataKey="temperature"
                type="bump"
                fill="url(#fillTemperature)"
                stroke="var(--color-sky-500)"
                strokeWidth={2}
              />
              <Area
                dataKey="ph"
                type="bump"
                fill="url(#fillPh)"
                stroke="var(--color-amber-500)"
                strokeWidth={2}
              />
              <Area
                dataKey="extract"
                type="bump"
                fill="url(#fillExtract)"
                stroke="var(--color-indigo-500)"
                strokeWidth={2}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
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
