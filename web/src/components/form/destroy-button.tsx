import { AlertCircle, Trash2 } from 'lucide-react'
import type { ComponentProps } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Button } from '../ui/button'

type DestroyButtonProps = ComponentProps<typeof Button> & {
  label?: string
  title?: string
  description?: string
  destroy: () => void
}

export function DestroyButton({
  label,
  title,
  description,
  destroy,
  ...props
}: DestroyButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button {...props} variant="secondary">
          {label || 'Excluir'} <AlertCircle />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm" className="border-destructive border">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>{title || 'Confirmação'}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || 'Essa ação não pode ser desfeita.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => destroy()}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
