const APP_TIME_ZONE = 'America/Sao_Paulo'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeZone: APP_TIME_ZONE,
})

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: APP_TIME_ZONE,
})

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return null

  return dateFormatter.format(new Date(value))
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return null

  return dateTimeFormatter.format(new Date(value))
}
