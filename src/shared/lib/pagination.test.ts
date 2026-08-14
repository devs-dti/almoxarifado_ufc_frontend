import { describe, expect, it } from 'vitest'
import { unwrapPage } from './pagination'

describe('unwrapPage', () => {
  it('normalizes backend PageResponseDTO payloads', () => {
    const page = unwrapPage({
      data: [{ id: 'material-1' }],
      meta: {
        page: 2,
        size: 10,
        totalElements: 25,
        totalPages: 3,
      },
    })

    expect(page).toEqual({
      content: [{ id: 'material-1' }],
      number: 2,
      size: 10,
      totalElements: 25,
      totalPages: 3,
    })
  })

  it('keeps existing Spring page payloads compatible with mocks', () => {
    const page = unwrapPage({
      content: [{ id: 'material-1' }],
      number: 0,
      size: 10,
      totalElements: 1,
      totalPages: 1,
    })

    expect(page.content).toHaveLength(1)
    expect(page.totalElements).toBe(1)
  })
})
