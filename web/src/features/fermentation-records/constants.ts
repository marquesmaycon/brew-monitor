import { CircleAlert, CircleCheck, CircleX } from 'lucide-react'

import type { FermentationRecordClassification } from '#/types/api'

export function getClassificationIcon(
  classification: FermentationRecordClassification,
) {
  return classification === 'WITHIN_STANDARD'
    ? CircleCheck
    : classification === 'ATTENTION'
      ? CircleAlert
      : CircleX
}

export const classificationClasses: Record<
  FermentationRecordClassification,
  string
> = {
  WITHIN_STANDARD:
    'border-emerald-200 bg-fresh-green/50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-fresh-green',
  ATTENTION:
    'border-amber-200 bg-amber/50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber',
  OUT_OF_STANDARD:
    'border-red-600 bg-coral/50 text-red-700 dark:border-red-900 dark:bg-red-800/40 dark:text-coral',
}

export const classificationLabels: Record<
  FermentationRecordClassification,
  string
> = {
  WITHIN_STANDARD: 'Dentro do padrão',
  ATTENTION: 'Atenção',
  OUT_OF_STANDARD: 'Fora do padrão',
}

export const classificationDescriptions: Record<
  FermentationRecordClassification,
  string
> = {
  WITHIN_STANDARD:
    'Os parâmetros registrados estão dentro da faixa esperada para esta cerveja.',
  ATTENTION:
    'Há parâmetros próximos do limite; acompanhe a evolução da fermentação.',
  OUT_OF_STANDARD:
    'Um ou mais parâmetros estão fora do padrão esperado; avalie ajustes no processo.',
}
