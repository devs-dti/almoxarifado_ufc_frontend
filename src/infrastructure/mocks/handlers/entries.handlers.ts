import { http, HttpResponse } from 'msw'
import type { Entry } from '@/features/entries/types'

let entries: Entry[] = [
  {
    id: 1,
    status: 'FINISHED',
    type: 'SUPPLIER',
    supplierId: 1,
    supplierName: 'Papelaria Central',
    responsible: 'Daniele Silva',
    items: [
      { id: 1, materialId: 1, materialName: 'Papel A4', quantity: 100, unitPrice: 25.9, lotId: 1, lotCode: 'LOT-001' },
    ],
    createdAt: '2025-06-01T10:00:00Z',
    finishedAt: '2025-06-01T11:00:00Z',
  },
  {
    id: 2,
    status: 'PENDING',
    type: 'DONATION',
    responsible: 'João Silva',
    items: [],
    createdAt: '2025-09-26T08:00:00Z',
  },
]

let nextId = 3

export const entriesHandlers = [
  http.get('/entries', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 0)
    const size = Number(url.searchParams.get('size') ?? 10)
    const content = entries.slice(page * size, page * size + size)
    return HttpResponse.json({ content, totalElements: entries.length, totalPages: Math.ceil(entries.length / size), number: page, size })
  }),

  http.get('/entries/:id', ({ params }) => {
    const entry = entries.find((e) => e.id === Number(params.id))
    return entry ? HttpResponse.json(entry) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/entries', async ({ request }) => {
    const body = await request.json() as { type: Entry['type']; supplierId?: number }
    const entry: Entry = { id: nextId++, status: 'PENDING', type: body.type, supplierId: body.supplierId, items: [], createdAt: new Date().toISOString() }
    entries.push(entry)
    return HttpResponse.json(entry, { status: 201 })
  }),

  http.patch('/entries/:id/details', async ({ request, params }) => {
    const idx = entries.findIndex((e) => e.id === Number(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Entry['invoice']
    entries[idx] = { ...entries[idx], invoice: body }
    return HttpResponse.json(entries[idx])
  }),

  http.post('/entries/:id/items', async ({ request, params }) => {
    const idx = entries.findIndex((e) => e.id === Number(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as { materialId: number; quantity: number; unitPrice: number }
    const item = { id: Date.now(), materialId: body.materialId, materialName: 'Material', quantity: body.quantity, unitPrice: body.unitPrice }
    entries[idx].items.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  http.delete('/entries/:id/items/:itemId', ({ params }) => {
    const idx = entries.findIndex((e) => e.id === Number(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    entries[idx].items = entries[idx].items.filter((i) => i.id !== Number(params.itemId))
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('/entries/:id/finish', ({ params }) => {
    const idx = entries.findIndex((e) => e.id === Number(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    entries[idx] = { ...entries[idx], status: 'FINISHED', finishedAt: new Date().toISOString() }
    return HttpResponse.json(entries[idx])
  }),

  http.patch('/entries/:id/cancel', ({ params }) => {
    const idx = entries.findIndex((e) => e.id === Number(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    entries[idx] = { ...entries[idx], status: 'CANCELED' }
    return HttpResponse.json(entries[idx])
  }),
]
