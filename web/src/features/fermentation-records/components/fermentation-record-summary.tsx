import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import BeerCard from '@/features/beers/components/beer-card'
import TankCard from '@/features/tanks/components/tank-card'
import type { FermentationRecord } from '@/types/api'
import { cn } from '#/lib/utils'

import {
  classificationClasses,
  classificationLabels,
  getClassificationIcon,
} from '../utils/constants'

type FermentationRecordSummaryProps = {
  record: FermentationRecord
}

export function FermentationRecordSummary({
  record: { classification, beer, tank },
}: FermentationRecordSummaryProps) {
  const ClassificationIcon = getClassificationIcon(classification)
  return (
    <div className="grid w-full justify-items-end gap-4 md:grid-cols-2 lg:grid-cols-1">
      <Alert
        className={cn(
          'md:col-span-2 lg:col-span-1 lg:max-w-md',
          classificationClasses[classification],
        )}
      >
        <ClassificationIcon />
        <AlertTitle>{classificationLabels[classification]}</AlertTitle>
        <AlertDescription>descrever</AlertDescription>
      </Alert>

      <BeerCard beer={beer} />

      <TankCard tank={tank} />
    </div>
  )
}
