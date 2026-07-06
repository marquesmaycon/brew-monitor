import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorDescription } from './utils'

/**
 * Instancia e configura o cliente do TanStack Query.
 * Estabelece as diretivas globais padrão: staleTime de 5 minutos, desativa retentativas automáticas (retry)
 * nas queries e intercepta erros de mutações globais para disparar notificações em toast na tela.
 *
 * @returns Instância do QueryClient configurada
 */
export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: false,
      },
      mutations: {
        onError: (err) => {
          toast.error('Ocorreu um erro inesperado. Tente novamente.', {
            description: getErrorDescription(err),
          })
        },
      },
    },
  })

  return { queryClient }
}
