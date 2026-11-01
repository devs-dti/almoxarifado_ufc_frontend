import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/infrastructure/mocks/server'
import { useAuthStore } from '@/store/useAuthStore'
import { ContractForm } from '@/features/contracts/components/ContractForm'
import { ContractsView } from '@/features/contracts/components/ContractsView'
import { renderWithProviders } from '@/test/render'

describe('Contratos', () => {
  it('envia filtros, ordenação e paginação compatíveis com a API', async () => {
    useAuthStore.setState({ user: { id: '1', name: 'Gestor', email: 'g@ufc.br', role: 'MANAGER' } })
    const requests: string[] = []
    server.use(http.get('/contracts', ({ request }) => {
      const p = new URL(request.url).searchParams; requests.push(p.toString()); const page = Number(p.get('page')); const size = Number(p.get('size'))
      return HttpResponse.json({ data: [{ id: '1', referenceNumber: 'CTR-1', companyName: 'Empresa', status: false, startDate: '2026-01-01', endDate: '2027-01-01' }], meta: { page, size, totalElements: 25, totalPages: Math.ceil(25 / size) } })
    }))
    const user = userEvent.setup()
    renderWithProviders(<ContractsView />)
    await screen.findByText('Mostrando 1–10 de 25 contratos')
    expect(screen.queryByRole('button', { name: /remover contrato/i })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Próxima página' }))
    await screen.findByText('Mostrando 11–20 de 25 contratos')
    await user.type(screen.getByLabelText('Referência'), 'CTR')
    await user.type(screen.getByLabelText('Empresa'), 'Odonto')
    await user.selectOptions(screen.getByLabelText('Status'), 'false')
    await user.selectOptions(screen.getByLabelText('Ordenar contratos por'), 'referenceNumber,desc')
    await user.selectOptions(screen.getByLabelText('Contratos por página'), '20')
    await waitFor(() => { const p = new URLSearchParams(requests.at(-1)); expect(p.get('search')).toBe('CTR'); expect(p.get('companyName')).toBe('Odonto'); expect(p.get('status')).toBe('false'); expect(p.get('page')).toBe('0'); expect(p.get('sort')).toBe('referenceNumber,desc'); expect(p.get('size')).toBe('20') })
  })

  it('carrega detalhes reais antes de editar e preserva empresa e fiscais', async () => {
    useAuthStore.setState({ user: { id: '1', name: 'Admin', email: 'a@ufc.br', role: 'ADMIN' } })
    const companyId = '00000000-0000-4000-8000-000000000001'
    const userId = '00000000-0000-4000-8000-000000000002'
    let sent: Record<string, unknown> | undefined
    server.use(
      http.get('/contracts', () => HttpResponse.json({ data: [{ id: 'c1', referenceNumber: 'CTR-1', companyName: 'Empresa real', status: true, startDate: '2026-01-01', endDate: '2027-01-01' }], meta: { page: 0, size: 10, totalElements: 1, totalPages: 1 } })),
      http.get('/contracts/c1', () => HttpResponse.json({ id: 'c1', referenceNumber: 'CTR-1', status: true, startDate: '2026-01-01', endDate: '2027-01-01', company: { id: companyId, name: 'Empresa real' }, users: [{ id: userId, name: 'Fiscal real' }] })),
      http.get('/companies', () => HttpResponse.json({ data: [{ id: companyId, name: 'Empresa real', sei: '123' }], meta: { page: 0, size: 10, totalElements: 1, totalPages: 1 } })),
      http.get('/users', () => HttpResponse.json({ data: [{ id: userId, name: 'Fiscal real', email: 'f@ufc.br', role: 'STAFF' }], meta: { page: 0, size: 10, totalElements: 1, totalPages: 1 } })),
      http.patch('/contracts/c1', async ({ request }) => { sent = await request.json() as Record<string, unknown>; return new HttpResponse(null, { status: 204 }) })
    )
    const user = userEvent.setup()
    renderWithProviders(<ContractsView />)
    await user.click(await screen.findByRole('button', { name: 'Editar contrato CTR-1' }))
    expect(await screen.findByText('Selecionada: Empresa real')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remover fiscal Fiscal real' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Salvar contrato' }))
    await waitFor(() => expect(sent).toBeDefined())
    expect(sent?.companyId).toBe(companyId)
    expect(sent?.userIds).toEqual([userId])
    expect(sent?.startDate).toBe('2026-01-01')
  })
  it('renova contrato sem fiscais e envia as datas no formato exigido', async () => {
    let sent: Record<string, unknown> | undefined
    server.use(http.post('/contracts/c1/renew', async ({ request }) => { sent = await request.json() as Record<string, unknown>; return HttpResponse.json({ id: 'new' }, { status: 201 }) }))
    const user = userEvent.setup()
    renderWithProviders(<ContractForm mode="renew" initialData={{ id: 'c1', referenceNumber: 'ANTIGO', startDate: '2025-01-01', endDate: '2025-12-31', status: true, company: { id: '00000000-0000-4000-8000-000000000001', name: 'Empresa' }, users: [] }} />)
    await user.type(screen.getByLabelText('Número de referência'), 'NOVO')
    await user.type(screen.getByLabelText('Data de início'), '2026-01-01')
    await user.type(screen.getByLabelText('Data de término'), '2026-12-31')
    await user.click(screen.getByRole('button', { name: 'Renovar contrato' }))
    await waitFor(() => expect(sent).toEqual({ referenceNumber: 'NOVO', startDate: '2026-01-01T00:00:00', endDate: '2026-12-31T00:00:00' }))
  })

})
