import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/infrastructure/mocks/server'
import { useAuthStore } from '@/store/useAuthStore'
import { UserFormDialog } from '@/features/users/components/UserFormDialog'
import { UserList } from '@/features/users/components/UserList'
import { renderWithProviders } from '@/test/render'

describe('Usuários', () => {
  it('envia filtros e paginação e substitui fotos que não carregam', async () => {
    useAuthStore.setState({ user: { id: 'admin', name: 'Admin', email: 'admin@ufc.br', role: 'ADMIN' } })
    const requests: string[] = []
    server.use(http.get('/users', ({ request }) => {
      const params = new URL(request.url).searchParams
      requests.push(params.toString())
      const page = Number(params.get('page'))
      const size = Number(params.get('size'))
      return HttpResponse.json({ data: [{ id: 'u1', name: 'Maria', email: 'm@ufc.br', role: 'STAFF', enabled: false, imageUrl: '/inexistente.png' }], meta: { page, size, totalElements: 25, totalPages: Math.ceil(25 / size) } })
    }))
    const user = userEvent.setup()
    renderWithProviders(<UserList />)
    fireEvent.error(await screen.findByAltText('Foto de Maria'))
    expect(screen.getByLabelText('Sem foto de Maria')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Próxima página' }))
    await screen.findByText('Mostrando 11–20 de 25 usuários')
    await user.type(screen.getByLabelText('Nome'), 'Maria')
    await user.selectOptions(screen.getByLabelText('Perfil'), 'STAFF')
    await user.selectOptions(screen.getByLabelText('Status'), 'false')
    await user.selectOptions(screen.getByLabelText('Ordenar usuários por'), 'name,desc')
    await user.selectOptions(screen.getByLabelText('Usuários por página'), '20')
    await waitFor(() => { const p = new URLSearchParams(requests.at(-1)); expect(p.get('search')).toBe('Maria'); expect(p.get('role')).toBe('STAFF'); expect(p.get('enabled')).toBe('false'); expect(p.get('page')).toBe('0'); expect(p.get('size')).toBe('20'); expect(p.get('sort')).toBe('name,desc') })
  })
  it('mostra a prévia da foto escolhida no formulário de usuário', async () => {
    const createUrl = vi.fn(() => 'blob:foto-teste')
    const revokeUrl = vi.fn()
    vi.stubGlobal('URL', class extends URL { static createObjectURL = createUrl; static revokeObjectURL = revokeUrl })
    try {
      const user = userEvent.setup()
      const { unmount } = renderWithProviders(<UserFormDialog open onOpenChange={() => {}} />)
      const file = new File(['imagem'], 'foto.png', { type: 'image/png' })
      await user.upload(screen.getByLabelText(/foto do usuário/i), file)
      expect(await screen.findByAltText('Foto de usuário')).toHaveAttribute('src', 'blob:foto-teste')
      expect(screen.getByText('foto.png')).toBeInTheDocument()
      unmount()
      expect(revokeUrl).toHaveBeenCalledWith('blob:foto-teste')
    } finally { vi.unstubAllGlobals() }
  })

})
