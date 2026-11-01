import { screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/infrastructure/mocks/server'
import { MaterialList } from '@/features/materials/components/MaterialList'
import { useAuthStore } from '@/store/useAuthStore'
import { renderWithProviders } from '@/test/render'

describe('Materiais', () => {
  it('envia os filtros, ordenação e paginação à API e reinicia a página', async () => {
    const requests: string[] = []
    server.use(http.get('/materials', ({ request }) => {
      const params = new URL(request.url).searchParams
      requests.push(params.toString())
      const page = Number(params.get('page'))
      const size = Number(params.get('size'))
      return HttpResponse.json({ data: [{ id: '1', name: 'Material', internalCode: 'COD', minQuantity: 1, materialGroupName: 'Grupo', measurementUnitName: 'Unidade' }], meta: { page, size, totalElements: 25, totalPages: Math.ceil(25 / size) } })
    }))
    const user = userEvent.setup()
    renderWithProviders(<MaterialList />)
    expect(await screen.findByText('Mostrando 1–10 de 25 materiais')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Próxima página' }))
    expect(await screen.findByText('Mostrando 11–20 de 25 materiais')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Nome ou descrição'), 'luva')
    await user.type(screen.getByLabelText('Código interno'), '123')
    await user.type(screen.getByLabelText('Grupo'), 'proteção')
    await user.type(screen.getByLabelText('Unidade de medida'), 'caixa')
    await waitFor(() => {
      const params = new URLSearchParams(requests.at(-1))
      expect(params.get('page')).toBe('0')
      expect(params.get('search')).toBe('luva')
      expect(params.get('internalCode')).toBe('123')
      expect(params.get('materialGroup')).toBe('proteção')
      expect(params.get('measurementUnit')).toBe('caixa')
    })
    await user.selectOptions(screen.getByLabelText('Ordenar materiais por'), 'internalCode,desc')
    await user.selectOptions(screen.getByLabelText('Materiais por página'), '20')
    await waitFor(() => {
      const params = new URLSearchParams(requests.at(-1))
      expect(params.get('sort')).toBe('internalCode,desc')
      expect(params.get('size')).toBe('20')
    })
    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    await waitFor(() => expect(new URLSearchParams(requests.at(-1)).has('search')).toBe(false))
  })

  it('abre os detalhes fornecidos pela API para um usuário da equipe', async () => {
    useAuthStore.setState({ user: { id: '1', name: 'Usuário', email: 'u@ufc.br', role: 'STAFF' } })
    const user = userEvent.setup()
    renderWithProviders(<MaterialList />)
    await user.type(screen.getByLabelText('Nome ou descrição'), 'Papel A4')
    await user.click(await screen.findByRole('button', { name: 'Ver detalhes de Papel A4' }))
    const dialog = await screen.findByRole('dialog', { name: 'Detalhes do material' })
    expect(await within(dialog).findByText('Papel A4')).toBeInTheDocument()
    expect(within(dialog).getByText('Papelaria')).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Editar material' })).not.toBeInTheDocument()
  })
})
