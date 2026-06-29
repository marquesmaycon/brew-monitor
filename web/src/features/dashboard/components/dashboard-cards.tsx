import { useQuery } from '@tanstack/react-query'
import type { LucideIcon } from 'lucide-react'
import { CircleAlert, CircleCheck, CircleX, ClipboardList } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { getDashboardMetricsOptions } from '../api/options'

type DashboardCard = {
  title: string
  description: string
  value: number
  icon: LucideIcon
  className: string
}

export function DashboardCards() {
  const { data, isError, isLoading } = useQuery(getDashboardMetricsOptions())

  const cards: Array<DashboardCard> = [
    {
      title: 'Total de registros fermentativos',
      description: 'Apontamentos cadastrados',
      value: data?.totalFermentationRecords ?? 0,
      icon: ClipboardList,
      className:
        'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300',
    },
    {
      title: 'Registros dentro do padrao',
      description: 'Parametros dentro dos limites',
      value: data?.withinStandardRecords ?? 0,
      icon: CircleCheck,
      className:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    {
      title: 'Registros que requerem atencao',
      description: 'Parametros em margem de tolerancia',
      value: data?.attentionRecords ?? 0,
      icon: CircleAlert,
      className:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
    },
    {
      title: 'Registros fora do padrao',
      description: 'Parametros acima da tolerancia',
      value: data?.outOfStandardRecords ?? 0,
      icon: CircleX,
      className:
        'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
    },
  ]

  return (
    <>
      {isError ? (
        <Card className="border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <CardHeader>
            <CardTitle>Nao foi possivel carregar o dashboard</CardTitle>
            <CardDescription>
              Verifique se a API esta em execucao e tente novamente.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <DashboardMetricCard
              key={card.title}
              card={card}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </>
  )
}

function DashboardMetricCard({
  card,
  isLoading,
}: {
  card: DashboardCard
  isLoading: boolean
}) {
  const Icon = card.icon

  return (
    <Card className={cn('min-h-40 border shadow-none', card.className)}>
      <CardHeader className="grid-cols-[1fr_auto] gap-3">
        <div className="space-y-1">
          <CardTitle className="text-sm leading-tight font-semibold">
            {card.title}
          </CardTitle>
          <CardDescription className="text-current/70">
            {card.description}
          </CardDescription>
        </div>
        <div className="bg-background/70 flex size-10 items-center justify-center rounded-full ring-1 ring-current/10">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="font-mono text-4xl font-semibold tabular-nums">
          {isLoading ? '-' : card.value}
        </p>
      </CardContent>
    </Card>
  )
}
