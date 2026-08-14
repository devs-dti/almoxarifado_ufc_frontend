import type { BackendPageResponse, PageLike, PaginatedResponse } from '@/shared/types/pagination'

export function unwrapPage<T>(page: PageLike<T>): PaginatedResponse<T> {
  if (Array.isArray(page)) {
    return {
      content: page,
      totalElements: page.length,
      totalPages: 1,
      number: 0,
      size: page.length,
    }
  }

  if ('content' in page) {
    return page
  }

  const backendPage = page as BackendPageResponse<T>

  return {
    content: backendPage.data,
    totalElements: backendPage.meta.totalElements,
    totalPages: backendPage.meta.totalPages,
    number: backendPage.meta.page,
    size: backendPage.meta.size,
  }
}
