import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/infrastructure/mocks/server'
import { useAuthStore } from '@/store/useAuthStore'
import { CompaniesList } from '@/features/companies/components/CompaniesList'
import { renderWithProviders } from '@/test/render'

describe('Empresas', () => {
  it('envia busca e paginação e restringe a remoção ao administrador', async () => {
    useAuthStore.setState({ user: { id: '1', name: 'Gestor', email: 'g@ufc.br', role: 'MANAGER' } })
    const requests: string[] = []
    server.use(http.get('/companies', ({ request }) => {
      const params = new URL(request.url).searchParams
      requests.push(params.toString())
      const page = Number(params.get('page'))
      const size = Number(params.get('size'))
      return HttpResponse.json({ data: [{ id: 's1', name: 'Empresa Exemplo', sei: 'SEI-001' }], meta: { page, size, totalElements: 25, totalPages: Math.ceil(25 / size) } })
    }))
    const user = userEvent.setup()
    renderWithProviders(<CompaniesList />)
    expect(await screen.findByText('Empresa Exemplo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar empresa Empresa Exemplo' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remover empresa Empresa Exemplo' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Próxima página' }))
    await screen.findByText('Mostrando 11–20 de 25 empresas')
    await user.type(screen.getByLabelText('Buscar empresas por nome ou SEI'), 'odonto')
    await waitFor(() => { const p = new URLSearchParams(requests.at(-1)); expect(p.get('search')).toBe('odonto'); expect(p.get('page')).toBe('0') })
    await user.selectOptions(screen.getByLabelText('Ordenar empresas por'), 'name,desc')
    await user.selectOptions(screen.getByLabelText('Empresas por página'), '20')
    await waitFor(() => { const p = new URLSearchParams(requests.at(-1)); expect(p.get('sort')).toBe('name,desc'); expect(p.get('size')).toBe('20') })
  })
})
