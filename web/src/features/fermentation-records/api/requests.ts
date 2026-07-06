import { api } from '@/lib/api'
import type {
  FermentationRecord,
  FermentationRecordPayload,
  Paginated,
  Pagination,
} from '@/types/api'

const resource = 'fermentation-records'

/**
 * Obtém a lista paginada de registros de fermentação.
 * Constrói os parâmetros de busca omitindo chaves de strings vazias, aplicando trim no termo 
 * de pesquisa e incluindo parâmetros de ordenação/filtragem apenas se estiverem definidos.
 *
 * @param pagination - Configurações de paginação, busca e ordenação
 * @returns Promise com o resultado paginado dos registros
 */
export function listFermentationRecords(pagination: Pagination) {
  const { search, sortBy, sortDirection, classification, ...pageParams } =
    pagination
  const searchParams = {
    ...pageParams,
    ...(search?.trim() ? { search: search.trim() } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortDirection ? { sortDirection } : {}),
    ...(classification ? { classification } : {}),
  }

  return api
    .get(resource, { searchParams })
    .json<Paginated<FermentationRecord>>()
}

export function getFermentationRecord(id: string) {
  return api.get(`${resource}/${id}`).json<FermentationRecord>()
}

export function createFermentationRecord(record: FermentationRecordPayload) {
  return api.post(resource, { json: record }).json<FermentationRecord>()
}

export function updateFermentationRecord(
  id: string,
  record: FermentationRecordPayload,
) {
  return api.put(`${resource}/${id}`, { json: record }).json<FermentationRecord>()
}

export function deleteFermentationRecord(id: string) {
  return api.delete(`${resource}/${id}`)
}
