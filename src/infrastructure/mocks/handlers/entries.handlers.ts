import { http, HttpResponse } from 'msw'
import { mockId } from '../utils'
import { getMockSupplierName } from './suppliers.handlers'
import type { AddEntryItemPayload, CreateEntryPayload, Entry, EntryItem } from '@/features/entries/types'

const entries: Entry[] = [
  {
    id: mockId(51),
    status: 'FINISHED',
    entryType: 'SUPPLIER',
    responsible: 'Daniele Silva',
    supplierDetails: { supplierId: mockId(1), supplierName: 'Papelaria Central', invoiceNumber: 'NF-1001', invoiceIssueDate: '2025-05-30T10:00:00', totalAmount: 1500, biddingCode: 'LIC-001', commitmentNote: 'EMP-001' },
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
    const [field, direction] = (url.searchParams.get('sort') ?? 'status,asc').split(',')
    const ordered = [...entries].sort((a, b) => {
      const key = field === 'arrivalAt' || field === 'entryType' ? field : 'status'
      return String(a[key]).localeCompare(String(b[key])) * (direction === 'desc' ? -1 : 1)
    })
    const content = ordered.slice(page * size, page * size + size)
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
      supplierDetails: body.supplierDetails ? { ...body.supplierDetails, supplierName: getMockSupplierName(body.supplierDetails.supplierId) } : null,
      items: [],
    }
    entries.push(entry)
    return HttpResponse.json({ id: entry.id }, { status: 201 })
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
      supplierDetails: body.entryType && body.entryType !== 'SUPPLIER' ? null : body.supplierDetails ? { ...body.supplierDetails, supplierName: getMockSupplierName(body.supplierDetails.supplierId) } : entries[idx].supplierDetails,
    }
    return HttpResponse.json(entries[idx])
  }),

  http.post('/entries/:id/items', async ({ request, params }) => {
    const idx = entries.findIndex((e) => e.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const rawBody = await request.json()
    const firstItem = (Array.isArray(rawBody) ? rawBody[0] : rawBody) as AddEntryItemPayload
    const item: EntryItem = {
      id: mockId(Date.now()),
      materialName: 'Material Teste',
      quantity: firstItem?.quantity,
      expirationType: firstItem?.expirationType,
      expirationDate: firstItem?.validity || null,
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
