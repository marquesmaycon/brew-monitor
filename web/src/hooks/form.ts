import { createFormHook } from '@tanstack/react-form'

import { ComboboxField } from '@/components/form/combobox-field'
import { DateTimePickerField } from '@/components/form/date-time-picker-field'
import { InputField } from '@/components/form/input-field'
import { SelectField } from '@/components/form/select-field'
import { SubmitButton } from '@/components/form/submit-button'
import { TextareaField } from '@/components/form/textarea-field'

import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextareaField,
    ComboboxField,
    DateTimePickerField,
    InputField,
    SelectField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
