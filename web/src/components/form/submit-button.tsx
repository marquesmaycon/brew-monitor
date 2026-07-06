import type { ComponentProps } from 'react'

import { useFormContext } from '@/hooks/form-context'

import { Button } from '../ui/button'

type SubmitButtonProps = ComponentProps<typeof Button> & {
  label?: string
}

/**
 * Botão de submissão do formulário.
 * Permanece desabilitado (`disabled={!isDirty}`) até que pelo menos um campo seja modificado, 
 * prevenindo requisições de salvamento desnecessárias ao servidor quando nenhum dado foi alterado.
 */
export function SubmitButton({ label, ...props }: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => [state.isDirty, state.isSubmitting]}>
      {([isDirty, isSubmitting]) => (
        <Button
          type="submit"
          disabled={!isDirty}
          variant="default"
          {...props}
          loading={isSubmitting || props.loading}
        >
          {label || 'Salvar'}
        </Button>
      )}
    </form.Subscribe>
  )
}
