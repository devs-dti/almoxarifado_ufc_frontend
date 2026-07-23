import { http, HttpResponse } from 'msw'
import type { Supplier } from '@/features/suppliers/types'

let suppliers: Supplier[] = [
  { id: 's0000000-0001-0001-0001-000000000001', corporateName: 'Papelaria Central', cnpj: '12.345.678/0001-90' },
  { id: 's0000000-0002-0002-0002-000000000002', corporateName: 'Distribuidora UFC', cnpj: '98.765.432/0001-10' },
]

function uuid(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

export const suppliersHandlers = [
  http.get('/suppliers', () =>
    HttpResponse.json({ content: suppliers.filter((s) => !s.deletedAt), totalElements: suppliers.length, totalPages: 1 })
  ),

  http.get('/suppliers/:id', ({ params }) => {
    const s = suppliers.find((s) => s.id === params.id && !s.deletedAt)
    return s ? HttpResponse.json(s) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/suppliers', async ({ request }) => {
    const body = await request.json() as CreateSupplierPayload
    const s: Supplier = { id: uuid(), ...body }
    suppliers.push(s)
    return HttpResponse.json(s, { status: 201 })
  }),

  http.patch('/suppliers/:id', async ({ request, params }) => {
    const idx = suppliers.findIndex((s) => s.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<Supplier>
    suppliers[idx] = { ...suppliers[idx], ...body }
    return HttpResponse.json(suppliers[idx])
  }),

  http.delete('/suppliers/:id', ({ params }) => {
    const idx = suppliers.findIndex((s) => s.id === params.id)
    if (idx !== -1) suppliers[idx] = { ...suppliers[idx], deletedAt: new Date().toISOString() }
    return new HttpResponse(null, { status: 204 })
  }),
]

type CreateSupplierPayload = { corporateName: string; cnpj?: string; phone?: string }
