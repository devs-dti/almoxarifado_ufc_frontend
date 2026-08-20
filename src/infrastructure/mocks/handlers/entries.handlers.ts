import { http, HttpResponse } from 'msw'
import { mockId } from '../utils'
import type { AddEntryItemPayload, CreateEntryPayload, Entry, EntryItem } from '@/features/entries/types'

const entries: Entry[] = [
  {
    id: mockId(51),
    status: 'FINISHED',
    entryType: 'SUPPLIER',
    responsible: 'Daniele Silva',
    items: [
      {
        id: mockId(61),
        materialName: 'Papel A4',
        quantity: 100,
        lotCode: 'LOT-001',
        expirationType: 'NON_EXPIRING',
      },
    ],
    arrivalAt: '2025-06-01T10:00:00Z',
  },
  {
    id: mockId(52),
    status: 'PENDING',
    entryType: 'DONATION',
    responsible: 'João Silva',
    items: [],
    arrivalAt: '2025-09-26T08:00:00Z',
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
        totalPages: Math.ceil(entries.length / size),
      },
    })
  }),

  http.get('/entries/:id', ({ params }) => {
    const entry = entries.find((e) => e.id === String(params.id))
    return entry ? HttpResponse.json(entry) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/entries', async ({ request }) => {
    const body = (await request.json()) as CreateEntryPayload
    const entry: Entry = {
      id: mockId(nextId++),
      status: 'PENDING',
      entryType: body.entryType,
      arrivalAt: body.arrivalAt || new Date().toISOString(),
      notes: body.notes,
      responsible: 'Usuário Conectado',
      items: [],
    }
    entries.push(entry)
    return HttpResponse.json(entry, { status: 201 })
  }),

  http.patch('/entries/:id/details', async ({ request, params }) => {
    const idx = entries.findIndex((e) => e.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = (await request.json()) as Partial<CreateEntryPayload>
    entries[idx] = {
      ...entries[idx],
      arrivalAt: body.arrivalAt || entries[idx].arrivalAt,
      entryType: body.entryType || entries[idx].entryType,
      notes: body.notes !== undefined ? body.notes : entries[idx].notes,
    }
    return HttpResponse.json(entries[idx])
  }),

  http.post('/entries/:id/items', async ({ request, params }) => {
    const idx = entries.findIndex((e) => e.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = (await request.json()) as AddEntryItemPayload
    const item: EntryItem = {
      id: mockId(Date.now()),
      materialName: 'Material Teste',
      quantity: body.quantity,
      expirationType: body.expirationType,
      expirationDate: body.validity || null,
      lotCode: `LOT-${Math.floor(Math.random() * 1000)}`,
    }
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
    entries[idx] = { ...entries[idx], status: 'FINISHED' }
    return HttpResponse.json(entries[idx])
  }),

  http.patch('/entries/:id/cancel', ({ params }) => {
    const idx = entries.findIndex((e) => e.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    entries[idx] = { ...entries[idx], status: 'CANCELED' }
    return HttpResponse.json(entries[idx])
  }),
]
