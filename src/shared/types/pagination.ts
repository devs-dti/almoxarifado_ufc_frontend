export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    page: number
    size: number
    totalElements: number
    totalPages: number
  }
}

export type PageParams = {
  page?: number
  size?: number
  sort?: string
}
