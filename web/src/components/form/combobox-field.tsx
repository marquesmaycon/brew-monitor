import { Loader2 } from 'lucide-react'

import { useFieldContext } from '@/hooks/form-context'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '../ui/combobox'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Item, ItemContent, ItemDescription, ItemTitle } from '../ui/item'

type ComboboxFieldOption = {
  label: string
  value: string
  description?: string
}

type ComboboxFieldProps = {
  disabled?: boolean
  emptyMessage?: string
  isLoading?: boolean
  label: string
  onSearchChange?: (search: string) => void
  options: Array<ComboboxFieldOption>
  placeholder?: string
  shouldFilter?: boolean
}

/**
 * Componente customizado de caixa de seleção (Combobox) integrado ao formulário.
 * A configuração de `shouldFilter={false}` combinada com `onSearchChange` desativa a filtragem cliente
 * local e delega a filtragem inteiramente à pesquisa server-side na API à medida que o usuário digita.
 */
export function ComboboxField({
  label,
  options,
  placeholder,
  emptyMessage = 'Nenhum resultado encontrado.',
  isLoading = false,
  onSearchChange,
  shouldFilter = true,
  ...props
}: ComboboxFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Combobox
        filter={shouldFilter ? undefined : null}
        items={options.map((option) => option.value)}
        value={field.state.value || null}
        onValueChange={(value) => {
          field.handleChange(value ?? '')
        }}
        onInputValueChange={(value) => {
          onSearchChange?.(value)
        }}
        itemToStringLabel={(value) =>
          options.find((option) => option.value === value)?.label ?? value
        }
        {...props}
      >
        <ComboboxInput
          id={field.name}
          name={field.name}
          placeholder={placeholder}
          className="w-full"
          showClear
          aria-invalid={isInvalid}
          onBlur={field.handleBlur}
        />
        <ComboboxContent>
          <ComboboxEmpty>
            {isLoading ? (
              <Loader2 className="mx-auto size-4 animate-spin" />
            ) : (
              emptyMessage
            )}
          </ComboboxEmpty>
          <ComboboxList>
            {options.map((option) => (
              <ComboboxItem key={option.value} value={option.value}>
                <Item size="xs" className="p-0">
                  <ItemContent>
                    <ItemTitle className="whitespace-nowrap">
                      {option.label}
                    </ItemTitle>
                    <ItemDescription>{option.description}</ItemDescription>
                  </ItemContent>
                </Item>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
