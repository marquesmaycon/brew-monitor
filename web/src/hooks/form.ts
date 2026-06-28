import { createFormHook } from '@tanstack/react-form'

import { InputField } from '#/components/form/input-field'
import { SubmitButton } from '#/components/form/submit-button'
import { TextareaField } from '#/components/form/textarea-field'

import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextareaField,
    InputField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
