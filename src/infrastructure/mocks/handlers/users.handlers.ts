import { http, HttpResponse } from 'msw'
import type { UserListItem } from '@/features/users/types'

const users: UserListItem[] = [
  { id: 1, name: 'Daniele Silva', email: 'admin@ufc.br', role: 'ADMIN' },
  { id: 2, name: 'João Guilherme', email: 'manager@ufc.br', role: 'MANAGER' },
  { id: 3, name: 'Maria Staff', email: 'staff@ufc.br', role: 'STAFF' },
]

let nextId = 4

export const usersHandlers = [
  http.get('/users', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 0)
    const size = Number(url.searchParams.get('size') ?? 10)
    const active = users.filter((u) => !u.deletedAt)
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
    const u = users.find((u) => u.id === Number(params.id) && !u.deletedAt)
    return u ? HttpResponse.json(u) : new HttpResponse(null, { status: 404 })
  }),

  http.post('/users', async ({ request }) => {
    const body = await request.json() as { name: string; email: string; role: UserListItem['role'] }
    const u: UserListItem = { id: nextId++, name: body.name, email: body.email, role: body.role }
    users.push(u)
    return HttpResponse.json(u, { status: 201 })
  }),

  http.patch('/users/:id', async ({ request, params }) => {
    const idx = users.findIndex((u) => u.id === Number(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    const body = await request.json() as Partial<UserListItem>
    users[idx] = { ...users[idx], ...body }
    return HttpResponse.json(users[idx])
  }),

  http.delete('/users/:id', ({ params }) => {
    const idx = users.findIndex((u) => u.id === Number(params.id))
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    users[idx] = { ...users[idx], deletedAt: new Date().toISOString() }
    return new HttpResponse(null, { status: 204 })
  }),
]
