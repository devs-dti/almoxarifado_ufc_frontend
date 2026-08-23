import { z } from 'zod'

const isValidYear = (val?: string) => {
  if (!val) return false
  const year = parseInt(val.split('-')[0], 10)
  return !isNaN(year) && year >= 2000 && year <= 2099
}

export const supplierDetailsSchema = z.object({
  supplierId: z.string().optional(),
  invoiceNumber: z.string().optional(),
  invoiceIssueDate: z.string().optional(),
  totalAmount: z.coerce.number().optional(),
  biddingCode: z.string().optional(),
  commitmentNote: z.string().optional(),
})

const formatIsoDateTime = (val?: string) => {
  if (!val) return ''
  try {
    const d = new Date(val.includes('T') ? val : `${val}T00:00:00`)
    if (!isNaN(d.getTime())) return d.toISOString()
  } catch {}
  if (val.length === 16) return `${val}:00Z`
  if (val.length === 10) return `${val}T00:00:00Z`
  return val
}

export const createEntrySchema = z.object({
  entryType: z.enum(['SUPPLIER', 'DONATION', 'INVENTORY_ADJUSTMENT', 'RETURN', 'OTHERS']),
  arrivalAt: z.string().min(1, 'Data e hora de chegada obrigatória').refine(isValidYear, 'Ano de chegada deve estar entre 2000 e 2099'),
  notes: z.string().optional(),
  supplierDetails: supplierDetailsSchema.optional(),
}).transform((data) => {
  const formattedArrival = formatIsoDateTime(data.arrivalAt)

  let formattedSupplierDetails = data.entryType === 'SUPPLIER' ? data.supplierDetails : undefined
  if (formattedSupplierDetails?.invoiceIssueDate) {
    formattedSupplierDetails = {
      ...formattedSupplierDetails,
      invoiceIssueDate: formatIsoDateTime(formattedSupplierDetails.invoiceIssueDate),
    }
  }

  return {
    ...data,
    arrivalAt: formattedArrival,
    supplierDetails: formattedSupplierDetails,
    supplierDetailsConsistent: data.entryType === 'SUPPLIER',
  }
}).superRefine((data, ctx) => {
  if (data.entryType === 'SUPPLIER') {
    if (!data.supplierDetails?.supplierId) {
      ctx.addIssue({
        path: ['supplierDetails', 'supplierId'],
        code: z.ZodIssueCode.custom,
        message: 'Selecione um fornecedor',
      })
    }
    if (!data.supplierDetails?.invoiceNumber) {
      ctx.addIssue({
        path: ['supplierDetails', 'invoiceNumber'],
        code: z.ZodIssueCode.custom,
        message: 'Número da nota fiscal obrigatório',
      })
    }
    if (!data.supplierDetails?.invoiceIssueDate || !isValidYear(data.supplierDetails.invoiceIssueDate)) {
      ctx.addIssue({
        path: ['supplierDetails', 'invoiceIssueDate'],
        code: z.ZodIssueCode.custom,
        message: 'Data de emissão com ano válido entre 2000 e 2099 obrigatória',
      })
    }
    if (data.supplierDetails?.totalAmount === undefined || Number(data.supplierDetails.totalAmount) <= 0) {
      ctx.addIssue({
        path: ['supplierDetails', 'totalAmount'],
        code: z.ZodIssueCode.custom,
        message: 'Valor total deve ser maior que zero',
      })
    }
    if (!data.supplierDetails?.biddingCode) {
      ctx.addIssue({
        path: ['supplierDetails', 'biddingCode'],
        code: z.ZodIssueCode.custom,
        message: 'Código de licitação obrigatório',
      })
    }
    if (!data.supplierDetails?.commitmentNote) {
      ctx.addIssue({
        path: ['supplierDetails', 'commitmentNote'],
        code: z.ZodIssueCode.custom,
        message: 'Nota de empenho obrigatória',
      })
    }
  }
})

export const addEntryItemSchema = z.object({
  materialId: z.string().min(1, 'Selecione um material'),
  quantity: z.coerce.number().positive('Quantidade deve ser positiva'),
  expirationType: z.enum(['DATED', 'NON_EXPIRING', 'INDEFINITE']),
  validity: z.string().optional().refine((val) => {
    if (!val) return true
    return isValidYear(val)
  }, 'Ano de validade deve estar entre 2000 e 2099'),
}).transform((data) => {
  let formattedValidity = data.validity
  if (formattedValidity) {
    formattedValidity = formattedValidity.split('T')[0] // Backend expects YYYY-MM-DD
  }

  return {
    ...data,
    validity: formattedValidity,
    validityConsistentWithExpirationType: true,
  }
}).superRefine((data, ctx) => {
  if (data.expirationType === 'DATED' && !data.validity) {
    ctx.addIssue({
      path: ['validity'],
      code: z.ZodIssueCode.custom,
      message: 'Data de validade é obrigatória para itens com validade',
    })
  }
})

export type CreateEntryInput = z.input<typeof createEntrySchema>
export type CreateEntryOutput = z.output<typeof createEntrySchema>
export type AddEntryItemInput = z.input<typeof addEntryItemSchema>
export type AddEntryItemOutput = z.output<typeof addEntryItemSchema>
