import { http, HttpResponse } from 'msw'
import { mockId } from '../utils'
import type { Supplier, CreateSupplierPayload } from '@/features/suppliers/types'

const suppliers: Supplier[] = [
  {
    id: mockId(1),
    corporateName: 'Papelaria Central',
    cnpj: '12.345.678/0001-90',
    email: 'contato@papelaria.com',
    phone: '85999999999',
    address: { street: 'Rua A', number: '123', city: 'Sobral', state: 'CE', cep: '62000-000' },
  },
  {
    id: mockId(2),
    corporateName: 'Distribuidora UFC',
    cnpj: '98.765.432/0001-10',
    email: 'vendas@dist.com',
    address: { street: 'Av B', number: '456', city: 'Sobral', state: 'CE', cep: '62010-000' },
  },
]

export function getMockSupplierName(id: string) {
  return suppliers.find((supplier) => supplier.id === id && !supplier.deletedAt)?.corporateName ?? null
}

let nextId = 3

export const suppliersHandlers = [
  http.get('/suppliers', ({ request }) => {
    const params = new URL(request.url).searchParams
    const page = Number(params.get('page') ?? 0)
    const size = Number(params.get('size') ?? 10)
    const search = (params.get('search') ?? '').toLowerCase().trim()
    const direction = params.get('sort')?.endsWith(',desc') ? -1 : 1
    const filtered = suppliers.filter((s) => !s.deletedAt && (!search || s.corporateName.toLowerCase().includes(search) || (s.cnpj ?? '').toLowerCase().includes(search))).sort((a, b) => a.corporateName.localeCompare(b.corporateName) * direction)
    const data = filtered.slice(page * size, (page + 1) * size).map(({ id, corporateName, cnpj, phone }) => ({ id, corporateName, cnpj, phone }))
    return HttpResponse.json({ data, meta: { page, size, totalElements: filtered.length, totalPages: Math.ceil(filtered.length / size) } })
  }),

  http.get('/suppliers/:id', ({ params }) => {
    const s = suppliers.find((s) => s.id === String(params.id) && !s.deletedAt)
    if (!s) return new HttpResponse(null, { status: 404 })
    const { phone: _phone, ...details } = s
    void _phone
    return HttpResponse.json(details)
  }),

  http.post('/suppliers', async ({ request }) => {
    const body = await request.json() as CreateSupplierPayload
    const s: Supplier = { id: mockId(nextId++), ...body }
    suppliers.push(s)
    return HttpResponse.json(s, { status: 201 })
  }),

  http.patch('/suppliers/:id', async ({ request, params }) => {
    const idx = suppliers.findIndex((s) => s.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<Supplier>
    suppliers[idx] = { ...suppliers[idx], ...body }
    return HttpResponse.json(suppliers[idx])
  }),

  http.delete('/suppliers/:id', ({ params }) => {
    const idx = suppliers.findIndex((s) => s.id === String(params.id))
    if (idx !== -1) suppliers[idx] = { ...suppliers[idx], deletedAt: new Date().toISOString() }
    return new HttpResponse(null, { status: 204 })
  }),
]
