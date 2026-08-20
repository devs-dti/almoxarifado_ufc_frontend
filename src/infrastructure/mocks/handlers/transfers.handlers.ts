import { http, HttpResponse } from 'msw'
import { mockId } from '../utils'
import type { ApproveTransferPayload, CreateTransferPayload, Transfer, TransferItem } from '@/features/transfers/types'

const transfers: Transfer[] = [
  {
    id: mockId(81),
    sector: 'TI',
    requester: 'João Silva',
    status: 'PENDING',
    exitType: 'SECTOR',
    items: [
      { id: mockId(91), name: 'Papel A4', quantity: 10, measurementUnit: 'UN' },
      { id: mockId(92), name: 'Caneta Azul', quantity: 5, measurementUnit: 'UN' },
    ],
    createdAt: '2025-09-26T09:00:00Z',
  },
]

let nextId = 2

export const transfersHandlers = [
  http.get('/transfers', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 0)
    const size = Number(url.searchParams.get('size') ?? 10)
    const content = transfers.slice(page * size, page * size + size)
    return HttpResponse.json({
      data: content,
      meta: {
        page,
        size,
        totalElements: transfers.length,
        totalPages: Math.ceil(transfers.length / size),
      },
    })
  }),

  http.get('/transfers/:id', ({ params }) => {
    const t = transfers.find((t) => t.id === String(params.id))
    return t ? HttpResponse.json(t) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/transfers', async ({ request }) => {
    const body = (await request.json()) as CreateTransferPayload
    const items: TransferItem[] = (body.items || []).map((item, i) => ({
      id: mockId(Date.now() + i),
      name: 'Material Teste',
      quantity: item.requestedQuantity,
      measurementUnit: 'UN',
    }))

    const t: Transfer = {
      id: mockId(nextId++),
      sector: 'Setor Solicitante',
      requester: 'Usuário Conectado',
      status: 'PENDING',
      exitType: body.exitType || 'SECTOR',
      items,
      createdAt: new Date().toISOString(),
    }
    transfers.push(t)
    return HttpResponse.json(t, { status: 201 })
  }),

  http.patch('/transfers/:id/approve', async ({ request, params }) => {
    const idx = transfers.findIndex((t) => t.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = (await request.json()) as ApproveTransferPayload
    transfers[idx].items = transfers[idx].items.map((item) => {
      const approved = body.items?.find((a) => a.transferItemId === item.id)
      return approved ? { ...item, quantity: approved.approvedQuantity } : item
    })
    transfers[idx].status = 'FINISHED'
    return HttpResponse.json(transfers[idx])
  }),

  http.patch('/transfers/:id/disapprove', ({ params }) => {
    const idx = transfers.findIndex((t) => t.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    transfers[idx].status = 'CANCELED'
    return new HttpResponse(null, { status: 204 })
  }),
]
