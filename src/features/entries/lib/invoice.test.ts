import { describe, expect, it } from 'vitest'
import { itemTotalCents } from './invoice'

describe('cálculo de itens da nota', () => {
  it('arredonda cada subtotal em centavos com quantidades fracionárias', () => {
    expect(itemTotalCents(1.5, '0.01')).toBe(2)
    expect(itemTotalCents(0.3, '0.10')).toBe(3)
    expect(itemTotalCents(2, '')).toBeNull()
    expect(itemTotalCents(2, '1.234')).toBeNull()
  })
})
