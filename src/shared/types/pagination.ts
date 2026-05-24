export type PaginatedResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export type PageParams = {
  page?: number
  size?: number
  sort?: string
}
