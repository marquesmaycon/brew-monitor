import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorDescription } from './utils'

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
