import { z } from 'zod'

export const supplierDetailsSchema = z.object({
  supplierId: z.string().min(1, 'Selecione um fornecedor'),
  invoiceNumber: z.string().min(1, 'Número da nota obrigatório'),
  invoiceIssueDate: z.string().min(1, 'Data de emissão obrigatória'), // Backend expects YYYY-MM-DD for date
  totalAmount: z.coerce.number().positive('Valor deve ser positivo'),
  biddingCode: z.string().min(1, 'Código de licitação obrigatório'),
  commitmentNote: z.string().min(1, 'Empenho obrigatório'),
})

export const createEntrySchema = z.object({
  entryType: z.enum(['SUPPLIER', 'DONATION', 'INVENTORY_ADJUSTMENT', 'RETURN', 'OTHERS']),
  arrivalAt: z.string().min(1, 'Data de chegada obrigatória'),
  notes: z.string().optional(),
  supplierDetails: supplierDetailsSchema.optional(),
}).transform((data) => {
  // Format arrivalAt to include seconds if missing (e.g. from datetime-local input)
  let formattedArrival = data.arrivalAt
  if (formattedArrival.length === 16) {
    formattedArrival = `${formattedArrival}:00`
  }
  
  // Format invoiceIssueDate to ensure it is just YYYY-MM-DD
  let formattedSupplierDetails = data.supplierDetails
  if (formattedSupplierDetails?.invoiceIssueDate) {
    formattedSupplierDetails = {
      ...formattedSupplierDetails,
      invoiceIssueDate: formattedSupplierDetails.invoiceIssueDate.split('T')[0]
    }
  }

  return {
    ...data,
    arrivalAt: formattedArrival,
    supplierDetails: formattedSupplierDetails,
    supplierDetailsConsistent: data.entryType === 'SUPPLIER',
  }
}).superRefine((data, ctx) => {
  if (data.entryType === 'SUPPLIER' && !data.supplierDetails?.supplierId) {
    ctx.addIssue({
      path: ['supplierDetails', 'supplierId'],
      code: z.ZodIssueCode.custom,
      message: 'Fornecedor é obrigatório para este tipo',
    })
  }
  if (data.entryType === 'SUPPLIER' && !data.supplierDetails?.invoiceNumber) {
    ctx.addIssue({
      path: ['supplierDetails', 'invoiceNumber'],
      code: z.ZodIssueCode.custom,
      message: 'Obrigatório',
    })
  }
  if (data.entryType === 'SUPPLIER' && !data.supplierDetails?.invoiceIssueDate) {
    ctx.addIssue({
      path: ['supplierDetails', 'invoiceIssueDate'],
      code: z.ZodIssueCode.custom,
      message: 'Obrigatório',
    })
  }
  if (data.entryType === 'SUPPLIER' && !data.supplierDetails?.totalAmount) {
    ctx.addIssue({
      path: ['supplierDetails', 'totalAmount'],
      code: z.ZodIssueCode.custom,
      message: 'Obrigatório',
    })
  }
})

export const addEntryItemSchema = z.object({
  materialId: z.string().min(1, 'Selecione um material'),
  quantity: z.coerce.number().positive('Quantidade deve ser positiva'),
  expirationType: z.enum(['DATED', 'NON_EXPIRING', 'INDEFINITE']),
  validity: z.string().optional(),
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
