import { useQueryClient } from '@tanstack/react-query'
import { CloudOff, RefreshCw } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'

import { dashboardKeys } from '../api/options'
import { useHasErroredDashboardQuery } from '../hooks/use-has-errored-dashboard-query'

export function ApiWakeUpAlert() {
  const queryClient = useQueryClient()
  const hasErroredDashboardQuery = useHasErroredDashboardQuery()

  function handleRetry() {
    void queryClient.invalidateQueries({ queryKey: dashboardKeys.root })
  }

  if (!hasErroredDashboardQuery) return null

  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-900 sm:pr-48 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
      <CloudOff className="size-4" aria-hidden="true" />
      <AlertTitle>API iniciando</AlertTitle>
      <AlertDescription className="pr-0 text-amber-800/90 dark:text-amber-100/80">
        O servico pode levar 1 a 2 minutos para responder apos um periodo de
        inatividade. Aguarde um pouco e tente novamente.
      </AlertDescription>
      <div className="mt-3 sm:absolute sm:top-2.5 sm:right-3 sm:mt-0">
        <Button type="button" variant="outline" size="sm" onClick={handleRetry}>
          <RefreshCw />
          Tentar novamente
        </Button>
      </div>
    </Alert>
  )
}
