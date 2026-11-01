import { http, HttpResponse } from 'msw'
import { mockId } from '../utils'
import type { Material, MaterialGroup, MeasurementUnit, CreateMaterialPayload } from '@/features/materials/types'

const groups: MaterialGroup[] = [
  { id: mockId(21), name: 'Papelaria' },
  { id: mockId(22), name: 'Limpeza' },
  { id: mockId(23), name: 'Informática' },
]

const units: MeasurementUnit[] = [
  { id: mockId(31), name: 'Unidade', abbreviation: 'un' },
  { id: mockId(32), name: 'Pacote', abbreviation: 'pct' },
  { id: mockId(33), name: 'Caixa', abbreviation: 'cx' },
  { id: mockId(34), name: 'Litro', abbreviation: 'L' },
]

const materials: Material[] = [
  { id: mockId(41), name: 'Papel A4', internalCode: 'PAP-001', minQuantity: 100, materialGroupName: groups[0].name, measurementUnitName: units[1].name },
  { id: mockId(42), name: 'Caneta Azul', internalCode: 'CAN-001', minQuantity: 50, materialGroupName: groups[0].name, measurementUnitName: units[0].name },
  { id: mockId(43), name: 'Detergente 500ml', internalCode: 'DET-001', minQuantity: 30, materialGroupName: groups[1].name, measurementUnitName: units[3].name },
  { id: mockId(44), name: 'Mouse USB', internalCode: 'MOU-001', minQuantity: 5, materialGroupName: groups[2].name, measurementUnitName: units[0].name },
]

for (let i = 5; i <= 50; i++) {
  materials.push({
    id: mockId(40 + i),
    name: `Material de Teste ${i}`,
    internalCode: `MAT-${String(i).padStart(3, '0')}`,
    minQuantity: Math.floor(Math.random() * 100),
    materialGroupName: groups[i % 3].name,
    measurementUnitName: units[i % 4].name,
  })
}

let nextId = 91

export const materialsHandlers = [
  http.get('/materials', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 0)
    const size = Number(url.searchParams.get('size') ?? 10)
    const search = (url.searchParams.get('search') ?? '').toLowerCase().trim()
    const code = (url.searchParams.get('internalCode') ?? '').toLowerCase().trim()
    const group = (url.searchParams.get('materialGroup') ?? '').toLowerCase().trim()
    const unit = (url.searchParams.get('measurementUnit') ?? '').toLowerCase().trim()
    const [sortField, direction] = (url.searchParams.get('sort') ?? 'name,asc').split(',')
    const active = materials.filter((m) => !m.deletedAt && (!search || m.name.toLowerCase().includes(search) || (m.description ?? '').toLowerCase().includes(search)) && (!code || m.internalCode.toLowerCase().includes(code)) && (!group || m.materialGroupName.toLowerCase().includes(group)) && (!unit || m.measurementUnitName.toLowerCase().includes(unit)))
      .sort((a, b) => (sortField === 'internalCode' ? a.internalCode.localeCompare(b.internalCode) : a.name.localeCompare(b.name)) * (direction === 'desc' ? -1 : 1))
    const content = active.slice(page * size, page * size + size)
    return HttpResponse.json({
      data: content,
      meta: {
        page,
        size,
        totalElements: active.length,
        totalPages: Math.ceil(active.length / size),
      },
    })
  }),

  http.get('/materials/:id', ({ params }) => {
    const mat = materials.find((m) => m.id === String(params.id) && !m.deletedAt)
    if (!mat) return new HttpResponse(null, { status: 404 })
    const group = groups.find((g) => g.name === mat.materialGroupName)
    const unit = units.find((u) => u.name === mat.measurementUnitName)
    return HttpResponse.json({ ...mat, updatedAt: null, materialGroup: group ?? { id: '', name: mat.materialGroupName }, measurementUnit: unit ?? { id: '', name: mat.measurementUnitName } })
  }),

  http.post('/materials', async ({ request }) => {
    const form = await request.formData()
    const body = Object.fromEntries(form.entries()) as unknown as CreateMaterialPayload
    body.minQuantity = Number(body.minQuantity)
    const group = groups.find((g) => g.id === body.materialGroupId) ?? groups[0]
    const unit = units.find((u) => u.id === body.measurementUnitId) ?? units[0]
    const mat: Material = {
      id: mockId(nextId++),
      name: body.name,
      internalCode: body.internalCode,
      minQuantity: body.minQuantity,
      description: body.description,
      materialGroupName: group.name,
      measurementUnitName: unit.name,
    }
    materials.push(mat)
    return HttpResponse.json(mat, { status: 201 })
  }),

  http.patch('/materials/:id', async ({ request, params }) => {
    const idx = materials.findIndex((m) => m.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const form = await request.formData()
    const body = Object.fromEntries(form.entries()) as unknown as Partial<CreateMaterialPayload>
    const group = groups.find((g) => g.id === body.materialGroupId)
    const unit = units.find((u) => u.id === body.measurementUnitId)
    materials[idx] = { ...materials[idx],
      ...(body.name !== undefined && { name: body.name }),
      ...(body.internalCode !== undefined && { internalCode: body.internalCode }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.minQuantity !== undefined && { minQuantity: Number(body.minQuantity) }),
      ...(group && { materialGroupName: group.name }),
      ...(unit && { measurementUnitName: unit.name }),
    }
    return HttpResponse.json(materials[idx])
  }),

  http.delete('/materials/:id', ({ params }) => {
    const idx = materials.findIndex((m) => m.id === String(params.id))
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

  http.get('/material-groups', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 0)
    const size = Number(url.searchParams.get('size') ?? 10)
    const search = url.searchParams.get('search')?.toLowerCase() ?? ''

    let active = groups
    if (search) {
      active = active.filter((g) => g.name.toLowerCase().includes(search))
    }

    const content = active.slice(page * size, page * size + size)
    return HttpResponse.json({
      data: content,
      meta: {
        page,
        size,
        totalElements: active.length,
        totalPages: Math.ceil(active.length / size),
      },
    })
  }),

  http.post('/material-groups', async ({ request }) => {
    const body = (await request.json()) as { name: string }
    const g: MaterialGroup = { id: mockId(Date.now()), name: body.name }
    groups.push(g)
    return HttpResponse.json(g, { status: 201 })
  }),

  http.patch('/material-groups/:id', async ({ request, params }) => {
    const idx = groups.findIndex((g) => g.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = (await request.json()) as { name: string }
    groups[idx] = { ...groups[idx], ...body }
    return HttpResponse.json(groups[idx])
  }),

  http.delete('/material-groups/:id', ({ params }) => {
    const groupId = String(params.id)
    const group = groups.find((g) => g.id === groupId)
    const isLinked = materials.some((m) => m.materialGroupName === group?.name && !m.deletedAt)
    if (isLinked) {
      return HttpResponse.json(
        { message: 'Não é possível remover o grupo, pois existem materiais vinculados a ele.' },
        { status: 409 }
      )
    }

    const idx = groups.findIndex((g) => g.id === groupId)
    if (idx !== -1) groups.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/measurement-units', () => HttpResponse.json(units)),

  http.post('/measurement-units', async ({ request }) => {
    const body = (await request.json()) as { name: string; abbreviation: string }
    const u: MeasurementUnit = { id: mockId(Date.now()), name: body.name, abbreviation: body.abbreviation }
    units.push(u)
    return HttpResponse.json(u, { status: 201 })
  }),

  http.patch('/measurement-units/:id', async ({ request, params }) => {
    const idx = units.findIndex((u) => u.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = (await request.json()) as { name?: string; abbreviation?: string }
    units[idx] = { ...units[idx], ...body }
    return HttpResponse.json(units[idx])
  }),

  http.delete('/measurement-units/:id', ({ params }) => {
    const idx = units.findIndex((u) => u.id === String(params.id))
    if (idx !== -1) units.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
