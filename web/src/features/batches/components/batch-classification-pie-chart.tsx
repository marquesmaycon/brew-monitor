import { Label, Pie, PieChart } from 'recharts'

import type { ChartConfig } from '@/components/ui/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type {
  BatchClassificationCount,
  FermentationRecordClassification,
} from '@/types/api'
import { classificationLabels } from '#/features/fermentation-records/utils/constants'

type BatchClassificationPieChartProps = {
  classificationCounts: Array<BatchClassificationCount>
}

const classificationColors: Record<FermentationRecordClassification, string> = {
  WITHIN_STANDARD: 'var(--color-emerald-500)',
  ATTENTION: 'var(--color-amber-500)',
  OUT_OF_STANDARD: 'var(--color-red-500)',
}

const chartConfig = {
  count: {
    label: 'Registros',
  },
  WITHIN_STANDARD: {
    label: classificationLabels.WITHIN_STANDARD,
    color: classificationColors.WITHIN_STANDARD,
  },
  ATTENTION: {
    label: classificationLabels.ATTENTION,
    color: classificationColors.ATTENTION,
  },
  OUT_OF_STANDARD: {
    label: classificationLabels.OUT_OF_STANDARD,
    color: classificationColors.OUT_OF_STANDARD,
  },
} satisfies ChartConfig

export function BatchClassificationPieChart({
  classificationCounts,
}: BatchClassificationPieChartProps) {
  const labelYOffset = -38

  const data = classificationCounts
    .map(({ classification, count }) => ({
      classification,
      count,
      fill: classificationColors[classification],
    }))
    .filter((item) => item.count > 0)

  const totalRecords = data.reduce((total, item) => total + item.count, 0)

  if (!totalRecords) {
    return (
      <div className="text-muted-foreground flex h-72 items-center justify-center rounded-lg border border-dashed text-sm">
        Nenhuma classificação encontrada.
      </div>
    )
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-72 max-h-72"
    >
      <PieChart accessibilityLayer>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="classification" />}
        />

        <Pie
          data={data}
          dataKey="count"
          cx="50%"
          cy="46%"
          nameKey="classification"
          innerRadius={56}
          outerRadius={84}
          strokeWidth={4}
        >
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox)) {
                return null
              }

              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy + labelYOffset}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy + labelYOffset}
                    className="fill-foreground text-3xl font-semibold"
                  >
                    {totalRecords.toLocaleString()}
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy + labelYOffset + 24}
                    className="fill-muted-foreground text-xs"
                  >
                    registros
                  </tspan>
                </text>
              )
            }}
          />
        </Pie>
        <ChartLegend
          height={0}
          content={<ChartLegendContent nameKey="classification" />}
          className="translate-y-1 flex-wrap gap-2"
        />
      </PieChart>
    </ChartContainer>
  )
}
