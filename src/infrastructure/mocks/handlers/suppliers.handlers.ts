import { http, HttpResponse } from 'msw'
import type { Supplier } from '@/features/suppliers/types'

const suppliers: Supplier[] = [
  { 
    id: 1, 
    corporateName: 'Papelaria Central', 
    cnpj: '12.345.678/0001-90', 
    email: 'contato@papelaria.com',
    address: { street: 'Rua A', number: '123', city: 'Sobral', state: 'CE', cep: '62000-000' }
  },
  { 
    id: 2, 
    corporateName: 'Distribuidora UFC', 
    cnpj: '98.765.432/0001-10', 
    email: 'vendas@dist.com',
    address: { street: 'Av B', number: '456', city: 'Sobral', state: 'CE', cep: '62010-000' }
  },
]

let nextId = 3

export const suppliersHandlers = [
  http.get('/suppliers', () =>
    HttpResponse.json(suppliers.filter((s) => !s.deletedAt))
  ),

  http.get('/suppliers/:id', ({ params }) => {
    const s = suppliers.find((s) => s.id === Number(params.id) && !s.deletedAt)
    return s ? HttpResponse.json(s) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/suppliers', async ({ request }) => {
    const body = await request.json() as Omit<Supplier, 'id'>
    const s: Supplier = { ...body, id: nextId++ }
    suppliers.push(s)
    return HttpResponse.json(s, { status: 201 })
  }),

  http.patch('/suppliers/:id', async ({ request, params }) => {
    const idx = suppliers.findIndex((s) => s.id === Number(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<Supplier>
    suppliers[idx] = { ...suppliers[idx], ...body }
    return HttpResponse.json(suppliers[idx])
  }),

  http.delete('/suppliers/:id', ({ params }) => {
    const idx = suppliers.findIndex((s) => s.id === Number(params.id))
    if (idx !== -1) suppliers[idx] = { ...suppliers[idx], deletedAt: new Date().toISOString() }
    return new HttpResponse(null, { status: 204 })
  }),
]
