import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/infrastructure/mocks/server'
import { useAuthStore } from '@/store/useAuthStore'
import { UnitList } from '@/features/sectors/components/UnitList'
import { renderWithProviders } from '@/test/render'

describe('Unidades de medida', () => {
  it('envia busca e paginação e restringe a remoção ao administrador', async () => {
    useAuthStore.setState({ user: { id: '1', name: 'Gestor', email: 'g@ufc.br', role: 'MANAGER' } })
    const requests: string[] = []
    server.use(http.get('/measurement-units', ({ request }) => {
      const params = new URL(request.url).searchParams
      requests.push(params.toString())
      const page = Number(params.get('page'))
      const size = Number(params.get('size'))
      return HttpResponse.json({ data: [{ id: 's1', name: 'Quilograma', abbreviation: 'kg' }], meta: { page, size, totalElements: 25, totalPages: Math.ceil(25 / size) } })
    }))
    const user = userEvent.setup()
    renderWithProviders(<UnitList />)
    expect(await screen.findByText('Quilograma')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar unidade Quilograma' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remover unidade Quilograma' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Próxima página' }))
    await screen.findByText('Mostrando 11–20 de 25 unidades')
    await user.type(screen.getByLabelText('Buscar unidades por nome ou abreviação'), 'odonto')
    await waitFor(() => { const p = new URLSearchParams(requests.at(-1)); expect(p.get('search')).toBe('odonto'); expect(p.get('page')).toBe('0') })
    await user.selectOptions(screen.getByLabelText('Ordenar unidades por'), 'name,desc')
    await user.selectOptions(screen.getByLabelText('Unidades de medida por página'), '20')
    await waitFor(() => { const p = new URLSearchParams(requests.at(-1)); expect(p.get('sort')).toBe('name,desc'); expect(p.get('size')).toBe('20') })
  })
})
