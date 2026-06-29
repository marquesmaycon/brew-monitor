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
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300',
  ATTENTION:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
  OUT_OF_STANDARD:
    'border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
}

export const classificationLabels: Record<
  FermentationRecordClassification,
  string
> = {
  WITHIN_STANDARD: 'Dentro do padrão',
  ATTENTION: 'Atenção',
  OUT_OF_STANDARD: 'Fora do padrão',
}
