export type PaginatedResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export type BackendPageResponse<T> = {
  data: T[]
  meta: {
    page: number
    size: number
    totalElements: number
    totalPages: number
  }
}

export type PageLike<T> = PaginatedResponse<T> | BackendPageResponse<T> | T[]

export type PageParams = {
  page?: number
  size?: number
  sort?: string
}
