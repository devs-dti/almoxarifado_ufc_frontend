import { describe, expect, it } from 'vitest'
import { formatInvoiceAmount, parseInvoiceAmount } from './invoice-amount'
import { createEntrySchema } from '../schemas'

describe('Valor total da nota fiscal', () => {
  it.each([
    ['4.700,00', 4700], ['4700,00', 4700], ['4700', 4700],
    ['4.700', 4700], ['4,70', 4.7], ['0,01', 0.01],
    ['1.234.567,89', 1234567.89], [' R$ 4.700,50 ', 4700.5],
    ['4700.00', 4700], ['4.70', 4.7], [4700, 4700], [4.7, 4.7],
  ])('interpreta %s sem confundir milhares e centavos', (value, expected) => {
    expect(parseInvoiceAmount(value)).toBe(expected)
  })

  it.each(['4.70000', '4.700,000', '4,700.00', '1.23.456', '4,,70', '4.700,', 'abc', '', '-4,70', Infinity, NaN, 4.123])(
    'rejeita %s em vez de converter ou arredondar silenciosamente', (value) => {
      expect(parseInvoiceAmount(value)).toBeNull()
    },
  )

  it('formata o valor validado no padrão brasileiro', () => {
    expect(formatInvoiceAmount(4700)).toBe('4.700,00')
    expect(formatInvoiceAmount(4.7)).toBe('4,70')
  })

  const base = {
    entryType: 'SUPPLIER' as const, arrivalAt: '2026-11-18T10:00',
    supplierDetails: {
      supplierId: 'fornecedor', invoiceNumber: 'NF-1', invoiceIssueDate: '2026-11-18',
      totalAmount: '4.700,00', biddingCode: 'LIC-1', commitmentNote: 'EMP-1',
    },
  }

  it('produz um número no schema antes de enviar para a API', () => {
    const parsed = createEntrySchema.parse(base)
    expect(parsed.supplierDetails?.totalAmount).toBe(4700)
  })

  it.each(['4.70000', '', '0,00'])('impede cadastrar fornecedor com total %s', (totalAmount) => {
    expect(createEntrySchema.safeParse({
      ...base, supplierDetails: { ...base.supplierDetails, totalAmount },
    }).success).toBe(false)
  })

  it('permite uma doação com o campo fiscal vazio e remove os dados fiscais do resultado', () => {
    const parsed = createEntrySchema.parse({
      ...base, entryType: 'DONATION', supplierDetails: { ...base.supplierDetails, totalAmount: '' },
    })
    expect(parsed.supplierDetails).toBeUndefined()
  })
})
