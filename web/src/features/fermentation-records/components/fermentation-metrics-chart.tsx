import { format } from 'date-fns'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import type { ChartConfig } from '@/components/ui/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

type FermentationMetricsPoint = {
  registeredAt: string
  temperature: number
  ph: number
  extract: number
}

type FermentationMetricsChartProps = {
  data: Array<FermentationMetricsPoint>
}

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

function getMetricDomain(data: Array<FermentationMetricsPoint>) {
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

export function FermentationMetricsChart({
  data,
}: FermentationMetricsChartProps) {
  const yAxisDomain = data.length ? getMetricDomain(data) : [0, 1]

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ bottom: 8, left: 0, right: 12, top: 12 }}
      >
        <defs>
          <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
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
  )
}
