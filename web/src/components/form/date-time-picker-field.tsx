import { CalendarIcon } from 'lucide-react'

import { useFieldContext } from '@/hooks/form-context'

import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

type DateTimePickerFieldProps = {
  label: string
}

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function toLocalDateTimeValue(date: Date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)

  return offsetDate.toISOString().slice(0, 16)
}

function parseFieldDate(value: string) {
  if (!value) {
    return undefined
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? undefined : date
}

function getTimeValue(value: string) {
  return value.split('T')[1] ?? '00:00'
}

export function DateTimePickerField({ label }: DateTimePickerFieldProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const selectedDate = parseFieldDate(field.state.value)

  function handleDateSelect(date?: Date) {
    if (!date) {
      return
    }

    const nextDate = selectedDate ?? new Date()
    nextDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
    field.handleChange(toLocalDateTimeValue(nextDate))
  }

  function handleTimeChange(time: string) {
    const nextDate = selectedDate ?? new Date()
    const [hours = '0', minutes = '0'] = time.split(':')

    nextDate.setHours(Number(hours), Number(minutes), 0, 0)
    field.handleChange(toLocalDateTimeValue(nextDate))
  }

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <div className="grid gap-2 sm:grid-cols-[1fr_8rem]">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={field.name}
              type="button"
              variant="outline"
              className="justify-start text-left font-normal"
              aria-invalid={isInvalid}
              onBlur={field.handleBlur}
            >
              <CalendarIcon />
              {selectedDate
                ? dateTimeFormatter.format(selectedDate)
                : 'Selecione a data'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          value={getTimeValue(field.state.value)}
          aria-invalid={isInvalid}
          onBlur={field.handleBlur}
          onChange={({ target }) => handleTimeChange(target.value)}
        />
      </div>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
