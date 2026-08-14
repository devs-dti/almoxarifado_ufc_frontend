import { http, HttpResponse } from 'msw'
import type { Material } from '@/features/materials/types'

const groups = [
  { id: 1, name: 'Papelaria' },
  { id: 2, name: 'Limpeza' },
  { id: 3, name: 'Informática' },
]

const units = [
  { id: 1, name: 'Unidade', abbreviation: 'un' },
  { id: 2, name: 'Pacote', abbreviation: 'pct' },
  { id: 3, name: 'Caixa', abbreviation: 'cx' },
  { id: 4, name: 'Litro', abbreviation: 'L' },
]

const materials: Material[] = [
  { id: 1, name: 'Papel A4', code: 'PAP-001', quantity: 500, minQuantity: 100, group: groups[0], unit: units[1] },
  { id: 2, name: 'Caneta Azul', code: 'CAN-001', quantity: 80, minQuantity: 50, group: groups[0], unit: units[0] },
  { id: 3, name: 'Detergente 500ml', code: 'DET-001', quantity: 20, minQuantity: 30, group: groups[1], unit: units[3] },
  { id: 4, name: 'Mouse USB', code: 'MOU-001', quantity: 15, minQuantity: 5, group: groups[2], unit: units[0] },
]

let nextId = 5

export const materialsHandlers = [
  http.get('/materials', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 0)
    const size = Number(url.searchParams.get('size') ?? 10)
    const active = materials.filter((m) => !m.deletedAt)
    const content = active.slice(page * size, page * size + size)
    return HttpResponse.json({ content, totalElements: active.length, totalPages: Math.ceil(active.length / size), number: page, size })
  }),

  http.get('/materials/:id', ({ params }) => {
    const mat = materials.find((m) => m.id === Number(params.id) && !m.deletedAt)
    return mat ? HttpResponse.json(mat) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/materials', async ({ request }) => {
    const body = await request.json() as { name: string; code: string; minQuantity: number; groupId: number; unitId: number }
    const group = groups.find((g) => g.id === body.groupId) ?? groups[0]
    const unit = units.find((u) => u.id === body.unitId) ?? units[0]
    const mat: Material = { id: nextId++, name: body.name, code: body.code, quantity: 0, minQuantity: body.minQuantity, group, unit }
    materials.push(mat)
    return HttpResponse.json(mat, { status: 201 })
  }),

  http.patch('/materials/:id', async ({ request, params }) => {
    const idx = materials.findIndex((m) => m.id === Number(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<Material>
    materials[idx] = { ...materials[idx], ...body }
    return HttpResponse.json(materials[idx])
  }),

  http.delete('/materials/:id', ({ params }) => {
    const idx = materials.findIndex((m) => m.id === Number(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    materials[idx] = { ...materials[idx], deletedAt: new Date().toISOString() }
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/materials/:id/movements', () => {
    return HttpResponse.json([
      { id: 1, type: 'ENTRY', quantity: 100, date: '2025-06-01', referenceId: 1 },
      { id: 2, type: 'TRANSFER', quantity: 20, date: '2025-06-10', referenceId: 1 },
    ])
  }),

  http.get('/material-groups', () => HttpResponse.json(groups)),
  http.post('/material-groups', async ({ request }) => {
    const body = await request.json() as { name: string }
    const g = { id: Date.now(), name: body.name }
    groups.push(g)
    return HttpResponse.json(g, { status: 201 })
  }),
  http.patch('/material-groups/:id', async ({ request, params }) => {
    const idx = groups.findIndex((g) => g.id === Number(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as { name: string }
    groups[idx] = { ...groups[idx], ...body }
    return HttpResponse.json(groups[idx])
  }),
  http.delete('/material-groups/:id', ({ params }) => {
    const idx = groups.findIndex((g) => g.id === Number(params.id))
    if (idx !== -1) groups.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/measurement-units', () => HttpResponse.json(units)),
  http.post('/measurement-units', async ({ request }) => {
    const body = await request.json() as { name: string; abbreviation: string }
    const u = { id: Date.now(), name: body.name, abbreviation: body.abbreviation }
    units.push(u)
    return HttpResponse.json(u, { status: 201 })
  }),
  http.patch('/measurement-units/:id', async ({ request, params }) => {
    const idx = units.findIndex((u) => u.id === Number(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as { name?: string; abbreviation?: string }
    units[idx] = { ...units[idx], ...body }
    return HttpResponse.json(units[idx])
  }),
  http.delete('/measurement-units/:id', ({ params }) => {
    const idx = units.findIndex((u) => u.id === Number(params.id))
    if (idx !== -1) units.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
