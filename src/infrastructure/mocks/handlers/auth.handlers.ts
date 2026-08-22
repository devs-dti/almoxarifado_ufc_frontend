import { http, HttpResponse } from 'msw'
import { mockId } from '../utils'

const MOCK_TOKEN = 'mock-jwt-access-token'

const mockUser = { id: mockId(1), name: 'Daniele Silva', email: 'admin@ufc.br', role: 'ADMIN' }

export const authHandlers = [
  http.post('/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string }
    if (
      typeof body.email === 'string' &&
      body.email.length > 0 &&
      typeof body.password === 'string' &&
      body.password.length >= 3
    ) {
      return HttpResponse.json({ ...mockUser, email: body.email })
    }
    return HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
  }),

  http.get('/auth/me', () => {
    return HttpResponse.json(mockUser)
  }),

  http.post('/auth/logout', () => new HttpResponse(null, { status: 204 })),

  http.post('/auth/refresh-token', () => {
    return HttpResponse.json({ token: MOCK_TOKEN })
  }),

  http.post('/auth/forgot-password', () =>
    HttpResponse.json({ message: 'Email de recuperação enviado' })
  ),

  http.post('/auth/reset-password/:token', () =>
    HttpResponse.json({ message: 'Senha redefinida com sucesso' })
  ),
]
