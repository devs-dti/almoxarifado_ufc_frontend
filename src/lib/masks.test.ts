import { describe, expect, it } from 'vitest'

import { maskCEP, maskCNPJ, maskPhone } from './masks'

describe('input masks', () => {
  it('formats CEP and limits extra digits', () => {
    expect(maskCEP('62000000123')).toBe('62000-000')
  })

  it('formats CNPJ from digits only', () => {
    expect(maskCNPJ('12345678000190')).toBe('12.345.678/0001-90')
  })

  it('formats mobile phone with ninth digit', () => {
    expect(maskPhone('85987654321')).toBe('(85) 98765-4321')
  })

  it('returns an empty string for empty optional values', () => {
    expect(maskCEP(undefined)).toBe('')
    expect(maskCNPJ('')).toBe('')
    expect(maskPhone(undefined)).toBe('')
  })
})
