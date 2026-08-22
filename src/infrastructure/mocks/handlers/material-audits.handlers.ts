import { http, HttpResponse } from 'msw'
import type {
  MaterialAuditDetails,
  CreateMaterialAuditPayload,
  UpdateMaterialAuditItemsPayload,
  AddAuditorsPayload
} from '@/features/material-audits/types'

const audits: MaterialAuditDetails[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    finishedAt: null,
    auditors: [
      { id: '1', name: 'Admin User' }
    ],
    items: [
      {
        id: 'item-1',
        materialId: '1',
        materialName: 'Papel A4',
        expirationType: 'NON_EXPIRING',
        expirationDate: null,
        systemQuantity: 500,
        physicalQuantity: 0,
        difference: -500
      },
      {
        id: 'item-1b',
        materialId: '3',
        materialName: 'Luva Descartável P',
        expirationType: 'DATED',
        expirationDate: '2027-03-15',
        systemQuantity: 26,
        physicalQuantity: 0,
        difference: -26
      },
      {
        id: 'item-1c',
        materialId: '4',
        materialName: 'Álcool Gel 500ml',
        expirationType: 'DATED',
        expirationDate: '2026-11-30',
        systemQuantity: 64,
        physicalQuantity: 0,
        difference: -64
      },
      {
        id: 'item-1d',
        materialId: '5',
        materialName: 'Grampeador de Mesa',
        expirationType: 'INDEFINITE',
        expirationDate: null,
        systemQuantity: 26,
        physicalQuantity: 0,
        difference: -26
      }
    ]
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    status: 'FINALIZED',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    finishedAt: new Date(Date.now() - 86400000).toISOString(),
    auditors: [
      { id: '2', name: 'Maria Silva' }
    ],
    items: [
      {
        id: 'item-2',
        materialId: '2',
        materialName: 'Caneta Azul',
        expirationType: 'DATED',
        expirationDate: '2026-12-31',
        systemQuantity: 80,
        physicalQuantity: 85,
        difference: 5
      },
      {
        id: 'item-2b',
        materialId: '6',
        materialName: 'Máscara Cirúrgica',
        expirationType: 'DATED',
        expirationDate: '2027-06-20',
        systemQuantity: 200,
        physicalQuantity: 195,
        difference: -5
      },
      {
        id: 'item-2c',
        materialId: '7',
        materialName: 'Caderno Universitário',
        expirationType: 'NON_EXPIRING',
        expirationDate: null,
        systemQuantity: 50,
        physicalQuantity: 50,
        difference: 0
      }
    ]
  }
]


export const materialAuditsHandlers = [
  http.get('/material-audits', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 0)
    const size = Number(url.searchParams.get('size') ?? 10)
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')
    const status = url.searchParams.get('status')

    let filtered = [...audits]

    // Filter by status
    if (status) {
      filtered = filtered.filter(a => a.status === status)
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate).getTime()
      filtered = filtered.filter(a => new Date(a.createdAt).getTime() >= start)
    }
    if (endDate) {
      const end = new Date(endDate).getTime() + 86400000 // include the end date
      filtered = filtered.filter(a => new Date(a.createdAt).getTime() <= end)
    }
    
    // Sort desc by createdAt
    const sorted = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    const content = sorted.slice(page * size, page * size + size)
    
    return HttpResponse.json({
      data: content,
      meta: {
        page,
        size,
        totalElements: sorted.length,
        totalPages: Math.ceil(sorted.length / size)
      }
    })
  }),

  http.get('/material-audits/:id', ({ params }) => {
    const audit = audits.find(a => a.id === params.id)
    if (!audit) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(audit)
  }),

  http.post('/material-audits', async ({ request }) => {
    const body = (await request.json()) as CreateMaterialAuditPayload
    
    const newAudit: MaterialAuditDetails = {
      id: crypto.randomUUID(),
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
      finishedAt: null,
      auditors: (body.auditorIds || []).map(id => ({ id, name: `Auditor ${id}` })),
      items: body.materialIds.map((mId) => ({
        id: `item-${crypto.randomUUID()}`,
        materialId: mId,
        materialName: `Material ${mId}`,
        expirationType: 'NON_EXPIRING',
        expirationDate: null,
        systemQuantity: Math.floor(Math.random() * 100),
        physicalQuantity: 0,
        difference: 0
      }))
    }
    
    audits.push(newAudit)
    return HttpResponse.json(newAudit.id, { status: 201 })
  }),

  http.patch('/material-audits/:id/items', async ({ request, params }) => {
    const audit = audits.find(a => a.id === params.id)
    if (!audit) return new HttpResponse(null, { status: 404 })
    if (audit.status !== 'IN_PROGRESS') return new HttpResponse(null, { status: 422 })

    const body = (await request.json()) as UpdateMaterialAuditItemsPayload
    
    body.items.forEach(updateItem => {
      const item = audit.items.find(i => i.id === updateItem.itemId)
      if (item) {
        item.physicalQuantity = updateItem.physicalQuantity
        item.difference = item.physicalQuantity - item.systemQuantity
      }
    })
    
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('/material-audits/:id/finalize', ({ params }) => {
    const audit = audits.find(a => a.id === params.id)
    if (!audit) return new HttpResponse(null, { status: 404 })
    if (audit.status !== 'IN_PROGRESS') return new HttpResponse(null, { status: 422 })

    audit.status = 'FINALIZED'
    audit.finishedAt = new Date().toISOString()
    
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('/material-audits/:id/cancel', ({ params }) => {
    const audit = audits.find(a => a.id === params.id)
    if (!audit) return new HttpResponse(null, { status: 404 })
    if (audit.status !== 'IN_PROGRESS') return new HttpResponse(null, { status: 422 })

    audit.status = 'CANCELED'
    audit.finishedAt = new Date().toISOString()
    
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch('/material-audits/:id/auditors', async ({ request, params }) => {
    const audit = audits.find(a => a.id === params.id)
    if (!audit) return new HttpResponse(null, { status: 404 })
    
    const body = (await request.json()) as AddAuditorsPayload
    const newAuditors = body.auditorIds.map(id => ({ id, name: `Auditor ${id}` }))
    
    audit.auditors = [...audit.auditors, ...newAuditors]
    
    return new HttpResponse(null, { status: 204 })
  }),
  
  // Mock Exports (Returns a tiny dummy PDF/Excel Blob)
  http.get('/material-audits/export/pdf', () => {
    return new HttpResponse(new Blob(['dummy pdf']), {
      headers: { 'Content-Type': 'application/pdf' }
    })
  }),
  http.get('/material-audits/export/excel', () => {
    return new HttpResponse(new Blob(['dummy excel']), {
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    })
  }),
  http.get('/material-audits/:id/export/pdf', () => {
    return new HttpResponse(new Blob(['dummy pdf']), {
      headers: { 'Content-Type': 'application/pdf' }
    })
  }),
  http.get('/material-audits/:id/export/excel', () => {
    return new HttpResponse(new Blob(['dummy excel']), {
      headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    })
  }),
]
