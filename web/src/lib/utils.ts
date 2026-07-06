import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { HTTPError } from 'ky'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extrai a descrição de erro de uma exceção capturada.
 * Lê a propriedade de dados de resposta customizada do ky (HTTPError.data), 
 * caindo para a mensagem de erro padrão (Error.message) ou undefined em caso de ausência.
 *
 * @param error - O objeto de erro capturado
 * @returns A mensagem de erro extraída ou undefined
 */
export async function getErrorDescription(error: unknown) {
  if (error instanceof HTTPError) {
    return error.data
  }

  if (error instanceof Error) {
    return error.message
  }

  return undefined
}
