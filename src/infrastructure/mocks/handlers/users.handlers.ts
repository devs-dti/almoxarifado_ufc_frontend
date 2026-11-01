import { http, HttpResponse } from 'msw'
import { mockId } from '../utils'
import type { UserListItem } from '@/features/users/types'

const users: UserListItem[] = [
  { id: mockId(1), name: 'Daniele Silva', email: 'admin@ufc.br', role: 'ADMIN', enabled: true },
  { id: mockId(2), name: 'João Guilherme', email: 'manager@ufc.br', role: 'MANAGER', enabled: true },
  { id: mockId(3), name: 'Maria Staff', email: 'staff@ufc.br', role: 'STAFF', enabled: true },
]

export function getMockUsers() { return users.filter((user) => !user.deletedAt) }

let nextId = 4

export const usersHandlers = [
  http.get('/users', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 0)
    const size = Number(url.searchParams.get('size') ?? 10)
    const search = (url.searchParams.get('search') ?? '').toLowerCase().trim()
    const role = url.searchParams.get('role')
    const enabled = url.searchParams.get('enabled')
    const direction = url.searchParams.get('sort')?.endsWith(',desc') ? -1 : 1
    const active = users.filter((u) => !u.deletedAt && (!search || u.name.toLowerCase().includes(search)) && (!role || u.role === role) && (enabled === null || u.enabled === (enabled === 'true'))).sort((a, b) => a.name.localeCompare(b.name) * direction)
    const content = active.slice(page * size, page * size + size)
    return HttpResponse.json({ 
      data: content, 
      meta: {
        page,
        size,
        totalElements: active.length, 
        totalPages: Math.ceil(active.length / size)
      }
    })
  }),

  http.get('/users/:id', ({ params }) => {
    const u = users.find((u) => u.id === String(params.id) && !u.deletedAt)
    return u ? HttpResponse.json(u) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/users', async ({ request }) => {
    const body = Object.fromEntries((await request.formData()).entries()) as unknown as { name: string; email: string; role: UserListItem['role'] }
    const u: UserListItem = { id: mockId(nextId++), name: body.name, email: body.email, role: body.role, enabled: true }
    users.push(u)
    return HttpResponse.json(u, { status: 201 })
  }),

  http.patch('/users/:id', async ({ request, params }) => {
    const idx = users.findIndex((u) => u.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = Object.fromEntries((await request.formData()).entries()) as unknown as Partial<UserListItem> & { enabled?: boolean | string }
    users[idx] = { ...users[idx], ...body, enabled: body.enabled === undefined ? users[idx].enabled : String(body.enabled) === 'true' }
    return HttpResponse.json(users[idx])
  }),

  http.delete('/users/:id', ({ params }) => {
    const idx = users.findIndex((u) => u.id === String(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    users[idx] = { ...users[idx], deletedAt: new Date().toISOString() }
    return new HttpResponse(null, { status: 204 })
  }),
]
