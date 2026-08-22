import { http, HttpResponse } from 'msw'

const MOCK_TOKEN = 'mock-jwt-access-token'

const mockUser = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'Daniele Silva',
  email: 'admin@ufc.br',
  jobTitle: 'Administrador do Almoxarifado',
  imageUrl: null,
  role: 'ADMIN',
  enabled: true,
  createdAt: '2026-08-21T01:46:25.063Z',
  updatedAt: '2026-08-21T01:46:25.063Z',
}

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
