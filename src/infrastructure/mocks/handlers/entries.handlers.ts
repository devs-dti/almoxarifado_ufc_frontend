import { http, HttpResponse } from 'msw'
import { mockId } from '../utils'
import type { AddEntryItemPayload, CreateEntryPayload, Entry } from '@/features/entries/types'

const entries: Entry[] = [
  {
    id: mockId(51),
    status: 'FINISHED',
    type: 'SUPPLIER',
    supplierId: mockId(1),
    supplierName: 'Papelaria Central',
    responsible: 'Daniele Silva',
    items: [
      { id: mockId(61), materialId: mockId(41), materialName: 'Papel A4', quantity: 100, unitPrice: 25.9, lotId: mockId(71), lotCode: 'LOT-001' },
    ],
    createdAt: '2025-06-01T10:00:00Z',
    finishedAt: '2025-06-01T11:00:00Z',
  },
  {
    id: mockId(52),
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
    return HttpResponse.json({ 
      data: content, 
      meta: {
        page,
        size,
        totalElements: entries.length, 
        totalPages: Math.ceil(entries.length / size)
      }
    })
  }),

  http.get('/entries/:id', ({ params }) => {
    const entry = entries.find((e) => e.id === String(params.id))
    return entry ? HttpResponse.json(entry) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/entries', async ({ request }) => {
    const body = await request.json() as CreateEntryPayload
    const entry: Entry = { id: mockId(nextId++), status: 'PENDING', type: body.type, supplierId: body.supplierId, items: [], createdAt: new Date().toISOString() }
    entries.push(entry)
    return HttpResponse.json(entry, { status: 201 })
  }),

  http.patch('/entries/:id/details', async ({ request, params }) => {
    const idx = entries.findIndex((e) => e.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Entry['invoice']
    entries[idx] = { ...entries[idx], invoice: body }
    return HttpResponse.json(entries[idx])
  }),

  http.post('/entries/:id/items', async ({ request, params }) => {
    const idx = entries.findIndex((e) => e.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as AddEntryItemPayload
    const item = { id: mockId(Date.now()), materialId: body.materialId, materialName: 'Material', quantity: body.quantity, unitPrice: body.unitPrice }
    entries[idx].items.push(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  http.delete('/entries/:id/items/:itemId', ({ params }) => {
    const idx = entries.findIndex((e) => e.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    entries[idx].items = entries[idx].items.filter((i) => i.id !== String(params.itemId))
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('/entries/:id/finish', ({ params }) => {
    const idx = entries.findIndex((e) => e.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    entries[idx] = { ...entries[idx], status: 'FINISHED', finishedAt: new Date().toISOString() }
    return HttpResponse.json(entries[idx])
  }),

  http.patch('/entries/:id/cancel', ({ params }) => {
    const idx = entries.findIndex((e) => e.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    entries[idx] = { ...entries[idx], status: 'CANCELED' }
    return HttpResponse.json(entries[idx])
  }),
]
