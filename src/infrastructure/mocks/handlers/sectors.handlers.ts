import { http, HttpResponse } from 'msw'
import { mockId } from '../utils'
import type { Sector, MeasurementUnit } from '@/features/sectors/types'

const sectors: Sector[] = [
  { id: mockId(1), name: 'TI', description: 'Tecnologia da Informação' },
  { id: mockId(2), name: 'Administrativo', description: 'Setor Administrativo' },
  { id: mockId(3), name: 'Biblioteca', description: 'Biblioteca Central' },
]

const units: MeasurementUnit[] = [
  { id: mockId(11), name: 'Unidade', abbreviation: 'un' },
  { id: mockId(12), name: 'Pacote', abbreviation: 'pct' },
  { id: mockId(13), name: 'Caixa', abbreviation: 'cx' },
  { id: mockId(14), name: 'Litro', abbreviation: 'L' },
  { id: mockId(15), name: 'Metro', abbreviation: 'm' },
  { id: mockId(16), name: 'Kilograma', abbreviation: 'kg' },
]

let nextSectorId = 4
let nextUnitId = 17

export const sectorsHandlers = [
  http.get('/sectors', () => HttpResponse.json(sectors.filter((s) => !s.deletedAt))),

  http.post('/sectors', async ({ request }) => {
    const body = await request.json() as { name: string; description?: string }
    const s: Sector = { id: mockId(nextSectorId++), name: body.name, description: body.description }
    sectors.push(s)
    return HttpResponse.json(s, { status: 201 })
  }),

  http.patch('/sectors/:id', async ({ request, params }) => {
    const idx = sectors.findIndex((s) => s.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<Sector>
    sectors[idx] = { ...sectors[idx], ...body }
    return HttpResponse.json(sectors[idx])
  }),

  http.delete('/sectors/:id', ({ params }) => {
    const idx = sectors.findIndex((s) => s.id === String(params.id))
    if (idx !== -1) sectors[idx] = { ...sectors[idx], deletedAt: new Date().toISOString() }
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/measurement-units', () => HttpResponse.json(units.filter((u) => !u.deletedAt))),

  http.post('/measurement-units', async ({ request }) => {
    const body = await request.json() as { name: string; abbreviation: string }
    const u: MeasurementUnit = { id: mockId(nextUnitId++), name: body.name, abbreviation: body.abbreviation }
    units.push(u)
    return HttpResponse.json(u, { status: 201 })
  }),

  http.patch('/measurement-units/:id', async ({ request, params }) => {
    const idx = units.findIndex((u) => u.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<MeasurementUnit>
    units[idx] = { ...units[idx], ...body }
    return HttpResponse.json(units[idx])
  }),

  http.delete('/measurement-units/:id', ({ params }) => {
    const idx = units.findIndex((u) => u.id === String(params.id))
    if (idx !== -1) units[idx] = { ...units[idx], deletedAt: new Date().toISOString() }
    return new HttpResponse(null, { status: 204 })
  }),
]
