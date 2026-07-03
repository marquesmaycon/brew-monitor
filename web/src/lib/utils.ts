import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { HTTPError } from 'ky'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function getErrorDescription(error: unknown) {
  if (error instanceof HTTPError) {
    return error.data
  }

  if (error instanceof Error) {
    return error.message
  }

  return undefined
}
