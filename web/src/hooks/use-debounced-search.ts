import { useEffect, useState } from 'react'

/**
 * Hook para debounce de busca.
 * @param defaultValue - Valor inicial da busca.
 * @param delay - Delay em milissegundos para debounce.
 * @returns [debouncedSearch, search, setSearch]
 */
export function useDebouncedSearch(defaultValue = '', delay = 400) {
  const [search, setSearch] = useState<string>(defaultValue)
  const [debouncedSearch, setDebouncedSearch] = useState<string>(defaultValue)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, delay)

    return () => window.clearTimeout(timeoutId)
  }, [search, delay])

  return [debouncedSearch, search, setSearch] as const
}
