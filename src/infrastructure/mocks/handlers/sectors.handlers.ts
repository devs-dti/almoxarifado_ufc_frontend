import { http, HttpResponse } from 'msw'
import type { Sector, MeasurementUnit } from '@/features/sectors/types'

let sectors: Sector[] = [
  { id: 'a1b2c3d4-0001-0001-0001-000000000001', name: 'TI', code: 'TI' },
  { id: 'a1b2c3d4-0002-0002-0002-000000000002', name: 'Administrativo', code: 'ADM' },
  { id: 'a1b2c3d4-0003-0003-0003-000000000003', name: 'Biblioteca', code: 'BIB' },
]

let units: MeasurementUnit[] = [
  { id: 'u0000000-0001-0001-0001-000000000001', name: 'Unidade', abbreviation: 'un' },
  { id: 'u0000000-0002-0002-0002-000000000002', name: 'Pacote', abbreviation: 'pct' },
  { id: 'u0000000-0003-0003-0003-000000000003', name: 'Caixa', abbreviation: 'cx' },
  { id: 'u0000000-0004-0004-0004-000000000004', name: 'Litro', abbreviation: 'L' },
  { id: 'u0000000-0005-0005-0005-000000000005', name: 'Metro', abbreviation: 'm' },
  { id: 'u0000000-0006-0006-0006-000000000006', name: 'Kilograma', abbreviation: 'kg' },
]

function uuid(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

export const sectorsHandlers = [
  http.get('/sectors', () =>
    HttpResponse.json({ content: sectors.filter((s) => !s.deletedAt), totalElements: sectors.length, totalPages: 1 })
  ),

  http.post('/sectors', async ({ request }) => {
    const body = await request.json() as { name: string; code?: string }
    const s: Sector = { id: uuid(), name: body.name, code: body.code }
    sectors.push(s)
    return HttpResponse.json(s, { status: 201 })
  }),

  http.patch('/sectors/:id', async ({ request, params }) => {
    const idx = sectors.findIndex((s) => s.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<Sector>
    sectors[idx] = { ...sectors[idx], ...body }
    return HttpResponse.json(sectors[idx])
  }),

  http.delete('/sectors/:id', ({ params }) => {
    const idx = sectors.findIndex((s) => s.id === params.id)
    if (idx !== -1) sectors[idx] = { ...sectors[idx], deletedAt: new Date().toISOString() }
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/measurement-units', () =>
    HttpResponse.json({ content: units.filter((u) => !u.deletedAt), totalElements: units.length, totalPages: 1 })
  ),

  http.post('/measurement-units', async ({ request }) => {
    const body = await request.json() as { name: string; abbreviation: string }
    const u: MeasurementUnit = { id: uuid(), name: body.name, abbreviation: body.abbreviation }
    units.push(u)
    return HttpResponse.json(u, { status: 201 })
  }),

  http.patch('/measurement-units/:id', async ({ request, params }) => {
    const idx = units.findIndex((u) => u.id === params.id)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<MeasurementUnit>
    units[idx] = { ...units[idx], ...body }
    return HttpResponse.json(units[idx])
  }),

  http.delete('/measurement-units/:id', ({ params }) => {
    const idx = units.findIndex((u) => u.id === params.id)
    if (idx !== -1) units[idx] = { ...units[idx], deletedAt: new Date().toISOString() }
    return new HttpResponse(null, { status: 204 })
  }),
]
