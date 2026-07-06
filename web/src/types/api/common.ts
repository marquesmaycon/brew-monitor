export type Pagination = {
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  classification?: string
}

export type Paginated<T> = {
  data: Array<T>
  meta: {
    total: number
  }
}

export type EntityTimestamps = {
  createdAt: string
  updatedAt: string | null
}
