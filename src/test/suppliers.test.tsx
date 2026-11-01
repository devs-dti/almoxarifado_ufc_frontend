import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/infrastructure/mocks/server'
import { useAuthStore } from '@/store/useAuthStore'
import { SupplierList } from '@/features/suppliers/components/SupplierList'
import { renderWithProviders } from '@/test/render'

describe('Fornecedores', () => {
  it('envia busca e paginação e restringe a remoção ao administrador', async () => {
    useAuthStore.setState({ user: { id: '1', name: 'Gestor', email: 'g@ufc.br', role: 'MANAGER' } })
    const requests: string[] = []
    server.use(http.get('/suppliers', ({ request }) => {
      const params = new URL(request.url).searchParams
      requests.push(params.toString())
      const page = Number(params.get('page'))
      const size = Number(params.get('size'))
      return HttpResponse.json({ data: [{ id: 's1', corporateName: 'Odontologia', cnpj: '12345678000190' }], meta: { page, size, totalElements: 25, totalPages: Math.ceil(25 / size) } })
    }))
    const user = userEvent.setup()
    renderWithProviders(<SupplierList />)
    expect(await screen.findByText('Odontologia')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Editar fornecedor Odontologia' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Remover fornecedor Odontologia' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Próxima página' }))
    await screen.findByText('Mostrando 11–20 de 25 fornecedores')
    await user.type(screen.getByLabelText('Buscar fornecedores por nome ou CNPJ'), 'odonto')
    await waitFor(() => { const p = new URLSearchParams(requests.at(-1)); expect(p.get('search')).toBe('odonto'); expect(p.get('page')).toBe('0') })
    await user.selectOptions(screen.getByLabelText('Ordenar fornecedores por'), 'corporateName,desc')
    await user.selectOptions(screen.getByLabelText('Fornecedores por página'), '20')
    await waitFor(() => { const p = new URLSearchParams(requests.at(-1)); expect(p.get('sort')).toBe('corporateName,desc'); expect(p.get('size')).toBe('20') })
  })
  it('carrega os detalhes antes de editar e mantém o telefone da listagem', async () => {
    useAuthStore.setState({ user: { id: '1', name: 'Gestor', email: 'g@ufc.br', role: 'MANAGER' } })
    server.use(
      http.get('/suppliers', () => HttpResponse.json({ data: [{ id: 's1', corporateName: 'Empresa', cnpj: '12345678000190', phone: '85999999999' }], meta: { page: 0, size: 10, totalElements: 1, totalPages: 1 } })),
      http.get('/suppliers/s1', () => HttpResponse.json({ id: 's1', corporateName: 'Empresa', cnpj: '12345678000190', email: 'empresa@exemplo.com', address: { street: 'Rua Um', number: '123', complement: 'Sala 1', city: 'Sobral', state: 'CE', cep: '62000000' } }))
    )
    const user = userEvent.setup()
    renderWithProviders(<SupplierList />)
    await user.click(await screen.findByRole('button', { name: 'Editar fornecedor Empresa' }))
    expect(await screen.findByDisplayValue('empresa@exemplo.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Rua Um')).toBeInTheDocument()
    expect(screen.getByDisplayValue('85999999999')).toBeInTheDocument()
  })

})
