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

/**
 * Formata um valor de data no formato curto pt-BR (DD/MM/AAAA) usando o fuso horário 'America/Sao_Paulo'.
 * Retorna null silenciosamente se a data for nula, indefinida ou vazia.
 *
 * @param value - Data a ser formatada
 * @returns String formatada ou null se o input for falsy
 */
export function formatDate(value: string | Date | null | undefined) {
  if (!value) return null

  return dateFormatter.format(new Date(value))
}

/**
 * Formata um valor de data no formato curto pt-BR (DD/MM/AAAA) usando o fuso horário 'America/Sao_Paulo'.
 * Retorna null silenciosamente se a data for nula, indefinida ou vazia.
 *
 * @param value - Data a ser formatada
 * @returns String formatada ou null se o input for falsy
 */
export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return null

  return dateTimeFormatter.format(new Date(value))
}
